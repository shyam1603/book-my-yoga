from fastapi import APIRouter, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from database.db import DB
from models.models import Booking, Schedule, YogaClassType, User, UserRole
from models.schemas import (
    BookingCreate, BookingResponse, ScheduleResponse, 
    UserResponse, ClassTypeResponse
)
from typing import List
from datetime import date, datetime

router = APIRouter()

@router.get("/schedules", response_model=List[ScheduleResponse])
async def get_available_schedules(
    class_type_id: int = None,
    date_filter: date = None,
    db: AsyncSession = DB
):
    """Get all available schedules for booking"""
    try:
        stmt = (
            select(Schedule)
            .options(
                selectinload(Schedule.class_type),
                selectinload(Schedule.instructor)
            )
            .order_by(Schedule.date, Schedule.time)
        )
        
        # Apply filters
        if class_type_id:
            stmt = stmt.where(Schedule.class_type_id == class_type_id)
        
        if date_filter:
            stmt = stmt.where(Schedule.date >= date_filter)
        else:
            # Only show future schedules by default
            stmt = stmt.where(Schedule.date >= date.today())
        
        result = await db.execute(stmt)
        schedules = result.scalars().all()
        
        return schedules
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch schedules: {str(e)}"
        )

@router.post("/bookings", response_model=BookingResponse)
async def create_booking(
    booking_data: BookingCreate,
    request: Request,
    db: AsyncSession = DB
):
    """Create a new booking"""
    try:
        user_id = request.state.user_id
        
        # Verify schedule exists and is available
        schedule_result = await db.execute(
            select(Schedule)
            .options(selectinload(Schedule.bookings))
            .where(Schedule.id == booking_data.schedule_id)
        )
        schedule = schedule_result.scalar_one_or_none()
        
        if not schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Schedule not found"
            )
        
        # Check if schedule is in the past
        schedule_datetime = datetime.combine(schedule.date, schedule.time)
        if schedule_datetime < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot book past schedules"
            )
        
        # Check capacity
        current_bookings = len(schedule.bookings)
        if current_bookings >= schedule.capacity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Schedule is fully booked"
            )
        
        # Check if user already has a booking for this schedule
        existing_booking_result = await db.execute(
            select(Booking).where(
                Booking.user_id == user_id,
                Booking.schedule_id == booking_data.schedule_id
            )
        )
        existing_booking = existing_booking_result.scalar_one_or_none()
        
        if existing_booking:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You already have a booking for this schedule"
            )
        
        new_booking = Booking(
            user_id=user_id,
            schedule_id=booking_data.schedule_id,
            notes=booking_data.notes
        )
        
        db.add(new_booking)
        await db.commit()
        await db.refresh(new_booking)
        
        # Load relationships
        await db.refresh(new_booking, ['schedule', 'user'])
        
        return new_booking
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create booking: {str(e)}"
        )

@router.get("/bookings", response_model=List[BookingResponse])
async def get_user_bookings(
    request: Request,
    db: AsyncSession = DB
):
    """Get all bookings for the current user"""
    try:
        user_id = request.state.user_id
        
        stmt = (
            select(Booking)
            .options(
                selectinload(Booking.schedule).selectinload(Schedule.class_type),
                selectinload(Booking.schedule).selectinload(Schedule.instructor)
            )
            .where(Booking.user_id == user_id)
            .order_by(Booking.created_at.desc())
        )
        result = await db.execute(stmt)
        bookings = result.scalars().all()
        
        return bookings
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch bookings: {str(e)}"
        )

@router.delete("/bookings/{booking_id}")
async def cancel_booking(
    booking_id: int,
    request: Request,
    db: AsyncSession = DB
):
    """Cancel a booking"""
    try:
        user_id = request.state.user_id
        
        stmt = (
            select(Booking)
            .options(selectinload(Booking.schedule))
            .where(Booking.id == booking_id, Booking.user_id == user_id)
        )
        result = await db.execute(stmt)
        booking = result.scalar_one_or_none()
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found or you don't have permission to cancel it"
            )
        
        # Check if booking is too close to start time (e.g., less than 2 hours)
        schedule_datetime = datetime.combine(booking.schedule.date, booking.schedule.time)
        time_until_class = schedule_datetime - datetime.now()
        
        if time_until_class.total_seconds() < 7200:  # 2 hours
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot cancel booking less than 2 hours before class starts"
            )
        
        await db.delete(booking)
        await db.commit()
        
        return {"message": "Booking cancelled successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to cancel booking: {str(e)}"
        )

@router.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int,
    request: Request,
    db: AsyncSession = DB
):
    """Get a specific booking"""
    try:
        user_id = request.state.user_id
        
        stmt = (
            select(Booking)
            .options(
                selectinload(Booking.schedule).selectinload(Schedule.class_type),
                selectinload(Booking.schedule).selectinload(Schedule.instructor)
            )
            .where(Booking.id == booking_id, Booking.user_id == user_id)
        )
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

@router.get("/teachers", response_model=List[UserResponse])
async def get_all_teachers(db: AsyncSession = DB):
    """Get all teachers"""
    try:
        stmt = (
            select(User)
            .where(User.role == UserRole.teacher)
            .order_by(User.name)
        )
        result = await db.execute(stmt)
        teachers = result.scalars().all()
        
        return teachers
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch teachers: {str(e)}"
        )