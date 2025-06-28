from fastapi import APIRouter, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.db import DB
from models.models import Booking 
from models.schemas import BookingCreate, BookingResponse
from typing import List

router = APIRouter()

@router.post("/bookings", response_model=BookingResponse)
async def create_booking(
    booking_data: BookingCreate,
    request: Request,
    db: AsyncSession = DB
):
    try:
        user_id = request.state.user_id
        
        new_booking = Booking(
            user_id=user_id,
            date=booking_data.date,
            time=booking_data.time,
            yoga_type=booking_data.yoga_type,
            instructor=booking_data.instructor,
            notes=booking_data.notes
        )
        
        db.add(new_booking)
        await db.commit()
        await db.refresh(new_booking)
        
        return new_booking
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create booking: {str(e)}"
        )

@router.get("/bookings", response_model=List[BookingResponse])
async def get_all_bookings(
    request: Request,
    db: AsyncSession = DB
):
    try:
        user_id = request.state.user_id
        
        stmt = select(Booking).where(Booking.user_id == user_id).order_by(Booking.date.desc(), Booking.created_at.desc())
        result = await db.execute(stmt)
        bookings = result.scalars().all()
        
        return bookings
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch bookings: {str(e)}"
        )

@router.delete("/bookings/{booking_id}")
async def delete_booking(
    booking_id: int,
    request: Request,
    db: AsyncSession = DB
):
    try:
        user_id = request.state.user_id
        
        stmt = select(Booking).where(Booking.id == booking_id, Booking.user_id == user_id)
        result = await db.execute(stmt)
        booking = result.scalar_one_or_none()
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found or you don't have permission to delete it"
            )
        
        await db.delete(booking)
        await db.commit()
        
        return {"message": "Booking deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete booking: {str(e)}"
        )

@router.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int,
    request: Request,
    db: AsyncSession = DB
):
    try:
        user_id = request.state.user_id
        
        stmt = select(Booking).where(Booking.id == booking_id, Booking.user_id == user_id)
        result = await db.execute(stmt)
        booking = result.scalar_one_or_none()
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        return booking
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch booking: {str(e)}"
        )