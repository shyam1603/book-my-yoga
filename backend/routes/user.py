from fastapi import APIRouter, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import models
from database.db import DB

router = APIRouter()

@router.get("/profile")
async def profile(db: AsyncSession = DB):
    userID = Request.state.user_id

    if not userID:
        raise HTTPException(status_code=401, detail="User not authenticated")
    result = await db.execute(select(models.User).filter_by(id=userID))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "created_at": user.created_at,
        "updated_at": user.updated_at
    }