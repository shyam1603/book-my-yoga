from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import schemas, models
from utils import auth
from database.db import DB

router = APIRouter()

@router.post("/signup", response_model=schemas.Token)
async def signup(user: schemas.UserCreate, db: AsyncSession = DB):
    result = await db.execute(select(models.User).filter_by(eamil=user.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    result = await db.execute(select(models.User).filter_by(email=user.email))
    existing_email = result.scalars().first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=auth.hash_password(user.password)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    token = auth.create_access_token({"user_id": new_user.id})
    refresh_token = auth.create_refresh_token({"user_id": new_user.id})
    return {
        "message": "User created successfully",
        "access_token": token,
        "refresh_token": refresh_token,
        "user" : {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
        }
    }

@router.post("/login", response_model=schemas.Token)
async def login(user: schemas.UserLogin, db: AsyncSession = DB):
    result = await db.execute(select(models.User).filter_by(email=user.email))
    db_user = result.scalars().first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth.create_access_token({"user_id": db_user.id})
    refresh_token = auth.create_refresh_token({"user_id": db_user.id})
    return {
        "message": "User created successfully",
        "access_token": token,
        "refresh_token": refresh_token,
        "user" : {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
        }
    }

@router.post("/refresh", response_model=schemas.Token)
async def refresh_token(refresh_token: str):
    payload = auth.decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    token = auth.create_access_token({"user_id": user_id})
    new_refresh_token = auth.create_refresh_token({"user_id": user_id})
    return {"token": token, "refresh_token": new_refresh_token}