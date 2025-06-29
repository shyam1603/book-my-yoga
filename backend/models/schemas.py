from pydantic import BaseModel, EmailStr
from datetime import date, datetime, time
from typing import Optional, List
from enum import Enum

class UserRole(str, Enum):
    teacher = "teacher"
    user = "user"

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[UserRole] = UserRole.user
    phone: Optional[str] = None
    bio: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = 0
    price_per_session: Optional[float] = 0.0

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    phone: Optional[str] = None
    bio: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    ratings: Optional[float] = None
    price_per_session: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    price_per_session: Optional[float] = None

# Class Type schemas
class ClassTypeCreate(BaseModel):
    name: str
    description: Optional[str] = None
    difficulty_level: Optional[str] = None
    base_price: Optional[float] = 0.0

class ClassTypeResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    difficulty_level: Optional[str] = None
    base_price: Optional[float] = None
    
    class Config:
        from_attributes = True

# Schedule schemas
class ScheduleCreate(BaseModel):
    class_type_id: int
    date: date
    time: time
    duration_minutes: int
    capacity: int

class ScheduleResponse(BaseModel):
    id: int
    class_type_id: int
    instructor_id: int
    date: date
    time: time
    duration_minutes: int
    capacity: int
    class_type: Optional[ClassTypeResponse] = None
    instructor: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True

class ScheduleWithBookings(ScheduleResponse):
    bookings: List["BookingResponse"] = []

# Updated Booking schemas
class BookingCreate(BaseModel):
    schedule_id: int
    notes: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    user_id: int
    schedule_id: int
    notes: Optional[str] = None
    created_at: datetime
    schedule: Optional[ScheduleResponse] = None
    user: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True

# Payment schemas
class PaymentCreate(BaseModel):
    amount: float
    method: Optional[str] = None

class PaymentResponse(BaseModel):
    id: int
    user_id: int
    amount: float
    status: str
    method: Optional[str] = None
    transaction_id: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserWithBookings(UserResponse):
    bookings: List[BookingResponse] = []

class Token(BaseModel):
    message: str
    access_token: str
    refresh_token: str
    user: UserResponse
