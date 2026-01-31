from pydantic import BaseModel, UUID4
from typing import Optional, List
from datetime import datetime
from .user import UserResponse

class CompanyBase(BaseModel):
    name: str

class CompanyCreate(CompanyBase):
    max_seats: Optional[int] = 10

class CompanyResponse(CompanyBase):
    id: UUID4
    invite_code: str
    max_seats: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class InviteCode(BaseModel):
    invite_code: str

class SeatResponse(BaseModel):
    id: UUID4
    company_id: UUID4
    user_id: Optional[UUID4]
    user: Optional[UserResponse]
    status: str
    assigned_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

class CompanySeatsResponse(BaseModel):
    seats: List[SeatResponse]
    available_count: int
    total_count: int
