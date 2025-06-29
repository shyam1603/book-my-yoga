from fastapi import APIRouter, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from database.db import DB
from models.models import YogaClassType
from models.schemas import ClassTypeCreate, ClassTypeResponse
from typing import List

router = APIRouter()

@router.get("/class-types", response_model=List[ClassTypeResponse])
async def get_all_class_types(db: AsyncSession = DB):
    """Get all available yoga class types"""
    try:
        stmt = select(YogaClassType).order_by(YogaClassType.name)
        result = await db.execute(stmt)
        class_types = result.scalars().all()
        
        return class_types
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch class types: {str(e)}"
        )

@router.post("/class-types", response_model=ClassTypeResponse)
async def create_class_type(
    class_type_data: ClassTypeCreate,
    request: Request,
    db: AsyncSession = DB
):
    """Create a new class type (admin only for now)"""
    try:
        # Check if class type with same name exists
        existing_result = await db.execute(
            select(YogaClassType).where(YogaClassType.name == class_type_data.name)
        )
        existing_class = existing_result.scalar_one_or_none()
        
        if existing_class:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Class type with this name already exists"
            )
        
        new_class_type = YogaClassType(
            name=class_type_data.name,
            description=class_type_data.description,
            difficulty_level=class_type_data.difficulty_level,
            base_price=class_type_data.base_price
        )
        
        db.add(new_class_type)
        await db.commit()
        await db.refresh(new_class_type)
        
        return new_class_type
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create class type: {str(e)}"
        )

@router.get("/class-types/{class_type_id}", response_model=ClassTypeResponse)
async def get_class_type(
    class_type_id: int,
    db: AsyncSession = DB
):
    """Get a specific class type by ID"""
    try:
        stmt = select(YogaClassType).where(YogaClassType.id == class_type_id)
        result = await db.execute(stmt)
        class_type = result.scalar_one_or_none()
        
        if not class_type:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Class type not found"
            )
        
        return class_type
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch class type: {str(e)}"
        )
