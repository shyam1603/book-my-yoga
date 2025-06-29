from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import schemas, models
from utils import auth
from database.db import DB

router = APIRouter()

@router.post("/signup", response_model=schemas.Token)
async def signup(user: schemas.UserCreate, db: AsyncSession = DB):
    
    result = await db.execute(select(models.User).filter_by(email=user.email))
    existing_email = result.scalars().first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=auth.hash_password(user.password),
        role=user.role,
        phone=user.phone,
        bio=user.bio,
        specialization=user.specialization,
        experience_years=user.experience_years,
        price_per_session=user.price_per_session
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    token = auth.create_access_token({
        "user_id": new_user.id,
        "email": new_user.email,
        "role": new_user.role.value,
        "username": new_user.name
    })
    refresh_token = auth.create_refresh_token({
        "user_id": new_user.id,
        "email": new_user.email,
        "role": new_user.role.value,
        "username": new_user.name
    })
    return {
        "message": "User created successfully",
        "access_token": token,
        "refresh_token": refresh_token,
        "user": new_user
    }

@router.post("/login", response_model=schemas.Token)
async def login(user: schemas.UserLogin, db: AsyncSession = DB):
    result = await db.execute(select(models.User).filter_by(email=user.email))
    db_user = result.scalars().first()
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth.create_access_token({
        "user_id": db_user.id,
        "email": db_user.email,
        "role": db_user.role.value,
        "username": db_user.name
    })
    refresh_token = auth.create_refresh_token({
        "user_id": db_user.id,
        "email": db_user.email,
        "role": db_user.role.value,
        "username": db_user.name
    })
    return {
        "message": "Login successful",
        "access_token": token,
        "refresh_token": refresh_token,
        "user": db_user
    }

@router.post("/refresh", response_model=schemas.Token)
async def refresh_token(refresh_token: str, db: AsyncSession = DB):
    payload = auth.decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    # Get updated user info
    result = await db.execute(select(models.User).filter_by(id=user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    token = auth.create_access_token({
        "user_id": user.id,
        "email": user.email,
        "role": user.role.value,
        "username": user.name
    })
    new_refresh_token = auth.create_refresh_token({
        "user_id": user.id,
        "email": user.email,
        "role": user.role.value,
        "username": user.name
    })
    return {
        "message": "Token refreshed successfully",
        "access_token": token,
        "refresh_token": new_refresh_token,
        "user": user
    }