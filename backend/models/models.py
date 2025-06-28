from sqlalchemy import Column, Integer, String, DateTime, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.db import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.current_timestamp())
    
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")

class Booking(Base):
    __tablename__ = 'bookings'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    date = Column(Date, nullable=False)
    time = Column(String(50), nullable=False)
    yoga_type = Column(String(50), nullable=False)
    instructor = Column(String(100), nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime, default=func.current_timestamp())
    
    user = relationship("User", back_populates="bookings")
