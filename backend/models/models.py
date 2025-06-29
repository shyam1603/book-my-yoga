from sqlalchemy import (
    Column, Integer, String, DateTime, Date, Text, ForeignKey,
    Enum, Float, Time
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.db import Base
import enum


# User roles
class UserRole(enum.Enum):
    teacher = "teacher"
    user = "user"


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.user)
    image = Column(String(255))  
    phone = Column(String(15), nullable=True)
    created_at = Column(DateTime, default=func.current_timestamp())

    bio = Column(Text, nullable=True)
    specialization = Column(String(100), nullable=True)
    experience_years = Column(Integer, default=0)
    ratings = Column(Float, default=0.0)  
    price_per_session = Column(Float, default=0.0)

    # Relationships
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")
    schedules = relationship("Schedule", back_populates="instructor", cascade="all, delete-orphan")


class YogaClassType(Base):
    __tablename__ = 'class_types'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    difficulty_level = Column(String(50))  # e.g. Beginner, Intermediate, Advanced
    base_price = Column(Float, default=0.0)

    schedules = relationship("Schedule", back_populates="class_type")


class Schedule(Base):
    __tablename__ = 'schedules'

    id = Column(Integer, primary_key=True, index=True)
    class_type_id = Column(Integer, ForeignKey('class_types.id'), nullable=False)
    instructor_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # User with role=teacher
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    capacity = Column(Integer, nullable=False)

    class_type = relationship("YogaClassType", back_populates="schedules")
    instructor = relationship("User", back_populates="schedules")  
    bookings = relationship("Booking", back_populates="schedule", cascade="all, delete-orphan")


class Booking(Base):
    __tablename__ = 'bookings'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    schedule_id = Column(Integer, ForeignKey('schedules.id'), nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime, default=func.current_timestamp())

    user = relationship("User", back_populates="bookings")
    schedule = relationship("Schedule", back_populates="bookings")


class Payment(Base):
    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(50), nullable=False)  # success, failed, pending
    method = Column(String(50))  
    transaction_id = Column(String(100), unique=True)
    created_at = Column(DateTime, default=func.current_timestamp())

    user = relationship("User")
