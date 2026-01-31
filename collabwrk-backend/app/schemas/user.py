from pydantic import BaseModel, EmailStr, UUID4
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    
class UserCreate(UserBase):
    auth0_id: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    
class UserResponse(UserBase):
    id: UUID4
    company_id: Optional[UUID4] = None
    seat_id: Optional[UUID4] = None
    role: str
    points: int
    solved_count: int
    rank: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
