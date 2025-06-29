from fastapi import APIRouter, HTTPException, Request, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from database.db import DB
from models.models import Schedule, YogaClassType, Booking, User, UserRole
from models.schemas import (
    ScheduleCreate, ScheduleResponse, ScheduleWithBookings,
    ClassTypeCreate, ClassTypeResponse, UserResponse
)
from typing import List
from datetime import date

router = APIRouter()

def require_teacher_role(request: Request):
    """Dependency to ensure user is a teacher"""
    user_role = getattr(request.state, 'user_role', None)
    if user_role != 'teacher':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can access this resource"
        )
    return True

@router.get("/schedules", response_model=List[ScheduleWithBookings])
async def get_teacher_schedules(
    request: Request,
    db: AsyncSession = DB,
    _: bool = Depends(require_teacher_role)
):
    """Get all schedules for the authenticated teacher"""
    try:
        teacher_id = request.state.user_id
        
        stmt = (
            select(Schedule)
            .options(
                selectinload(Schedule.class_type),
                selectinload(Schedule.bookings).selectinload(Booking.user)
            )
            .where(Schedule.instructor_id == teacher_id)
            .order_by(Schedule.date, Schedule.time)
        )
        result = await db.execute(stmt)
        schedules = result.scalars().all()
        
        return schedules
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch schedules: {str(e)}"
        )

@router.post("/schedules", response_model=ScheduleResponse)
async def create_schedule(
    schedule_data: ScheduleCreate,
    request: Request,
    db: AsyncSession = DB,
    _: bool = Depends(require_teacher_role)
):
    """Create a new schedule for the authenticated teacher"""
    try:
        teacher_id = request.state.user_id
        
        # Verify class type exists
        class_type_result = await db.execute(
            select(YogaClassType).where(YogaClassType.id == schedule_data.class_type_id)
        )
        class_type = class_type_result.scalar_one_or_none()
        if not class_type:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Class type not found"
            )
        
        new_schedule = Schedule(
            class_type_id=schedule_data.class_type_id,
            instructor_id=teacher_id,
            date=schedule_data.date,
            time=schedule_data.time,
            duration_minutes=schedule_data.duration_minutes,
            capacity=schedule_data.capacity
        )
        
        db.add(new_schedule)
        await db.commit()
        await db.refresh(new_schedule)
        
        # Load relationships
        await db.refresh(new_schedule, ['class_type', 'instructor'])
        
        return new_schedule
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create schedule: {str(e)}"
        )

@router.get("/schedules/{schedule_id}", response_model=ScheduleWithBookings)
async def get_schedule_detail(
    schedule_id: int,
    request: Request,
    db: AsyncSession = DB,
    _: bool = Depends(require_teacher_role)
):
    """Get detailed information about a specific schedule"""
    try:
        teacher_id = request.state.user_id
        
        stmt = (
            select(Schedule)
            .options(
                selectinload(Schedule.class_type),
                selectinload(Schedule.bookings).selectinload(Booking.user)
            )
            .where(Schedule.id == schedule_id, Schedule.instructor_id == teacher_id)
        )
        result = await db.execute(stmt)
        schedule = result.scalar_one_or_none()
        
        if not schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Schedule not found"
            )
        
        return schedule
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch schedule: {str(e)}"
        )

@router.delete("/schedules/{schedule_id}")
async def delete_schedule(
    schedule_id: int,
    request: Request,
    db: AsyncSession = DB,
    _: bool = Depends(require_teacher_role)
):
    """Delete a schedule (only if no bookings exist)"""
    try:
        teacher_id = request.state.user_id
        
        stmt = (
            select(Schedule)
            .options(selectinload(Schedule.bookings))
            .where(Schedule.id == schedule_id, Schedule.instructor_id == teacher_id)
        )
        result = await db.execute(stmt)
        schedule = result.scalar_one_or_none()
        
        if not schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Schedule not found"
            )
        
        if schedule.bookings:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete schedule with existing bookings"
            )
        
        await db.delete(schedule)
        await db.commit()
        
        return {"message": "Schedule deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete schedule: {str(e)}"
        )

@router.get("/students", response_model=List[UserResponse])
async def get_teacher_students(
    request: Request,
    db: AsyncSession = DB,
    _: bool = Depends(require_teacher_role)
):
    """Get all students who have booked with this teacher"""
    try:
        teacher_id = request.state.user_id
        
        stmt = (
            select(User)
            .join(Booking, User.id == Booking.user_id)
            .join(Schedule, Booking.schedule_id == Schedule.id)
            .where(Schedule.instructor_id == teacher_id)
            .distinct()
        )
        result = await db.execute(stmt)
        students = result.scalars().all()
        
        return students
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch students: {str(e)}"
        )

@router.get("/dashboard")
async def get_teacher_dashboard(
    request: Request,
    db: AsyncSession = DB,
    _: bool = Depends(require_teacher_role)
):
    """Get teacher dashboard data"""
    try:
        teacher_id = request.state.user_id
        
        # Get total schedules
        total_schedules_result = await db.execute(
            select(Schedule).where(Schedule.instructor_id == teacher_id)
        )
        total_schedules = len(total_schedules_result.scalars().all())
        
        # Get total bookings
        total_bookings_result = await db.execute(
            select(Booking)
            .join(Schedule, Booking.schedule_id == Schedule.id)
            .where(Schedule.instructor_id == teacher_id)
        )
        total_bookings = len(total_bookings_result.scalars().all())
        
        # Get unique students
        students_result = await db.execute(
            select(User.id)
            .join(Booking, User.id == Booking.user_id)
            .join(Schedule, Booking.schedule_id == Schedule.id)
            .where(Schedule.instructor_id == teacher_id)
            .distinct()
        )
        unique_students = len(students_result.scalars().all())
        
        # Get upcoming schedules (next 7 days)
        from datetime import datetime, timedelta
        today = date.today()
        next_week = today + timedelta(days=7)
        
        upcoming_schedules_result = await db.execute(
            select(Schedule)
            .options(selectinload(Schedule.class_type))
            .where(
                Schedule.instructor_id == teacher_id,
                Schedule.date >= today,
                Schedule.date <= next_week
            )
            .order_by(Schedule.date, Schedule.time)
            .limit(5)
        )
        upcoming_schedules = upcoming_schedules_result.scalars().all()
        
        return {
            "total_schedules": total_schedules,
            "total_bookings": total_bookings,
            "unique_students": unique_students,
            "upcoming_schedules": upcoming_schedules
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch dashboard data: {str(e)}"
        )
