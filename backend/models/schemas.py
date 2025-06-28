from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    date: date
    time: str
    yoga_type: str
    instructor: str
    notes: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    user_id: int
    date: date
    time: str
    yoga_type: str
    instructor: str
    notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserWithBookings(UserResponse):
    bookings: List[BookingResponse] = []

class Token(BaseModel):
    token: str
    refresh_token: str
