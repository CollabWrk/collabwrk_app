import random
import string
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException
from app.models.company import Company
from app.models.seat import Seat
from app.models.user import User

def generate_invite_code(length=8):
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

async def create_company(db: AsyncSession, name: str, creator_id: str, max_seats: int = 10):
    # Retrieve user
    stmt = select(User).where(User.id == creator_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.company_id:
        raise HTTPException(status_code=400, detail="User already belongs to a company")

    # Generate unique invite code
    invite_code = generate_invite_code()
    # TODO: Check uniqueness in DB loop
    
    company = Company(
        name=name,
        invite_code=invite_code,
        max_seats=max_seats
    )
    db.add(company)
    await db.flush() # flush to get ID
    
    # Create Seat for owner
    seat = Seat(
        company_id=company.id,
        user_id=user.id,
        status="assigned",
        assigned_at=func.now()
    )
    db.add(seat)
    await db.flush()
    
    # Update User
    user.company_id = company.id
    user.seat_id = seat.id
    user.role = "admin" # Creator is admin
    
    await db.commit()
    await db.refresh(company)
    return company

async def join_company(db: AsyncSession, user_id: str, invite_code: str):
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.company_id:
        raise HTTPException(status_code=400, detail="User already belongs to a company")
        
    # Find company by invite code
    stmt = select(Company).where(Company.invite_code == invite_code)
    result = await db.execute(stmt)
    company = result.scalars().first()
    
    if not company:
        raise HTTPException(status_code=404, detail="Invalid invite code")
        
    # Check for available seats
    # Count current assigned seats
    stmt = select(func.count(Seat.id)).where(Seat.company_id == company.id, Seat.status == "assigned")
    result = await db.execute(stmt)
    assigned_count = result.scalar()
    
    if assigned_count >= company.max_seats:
        raise HTTPException(status_code=400, detail="No seats available in this company")
        
    # Create or assign seat
    # Check if there are any unassigned seats created previously? 
    # For MVP we just create a new seat if we under max_seats
    
    seat = Seat(
        company_id=company.id,
        user_id=user.id,
        status="assigned",
        assigned_at=func.now()
    )
    db.add(seat)
    
    user.company_id = company.id
    user.seat_id = seat.id
    
    await db.commit()
    return company

async def get_company_seats(db: AsyncSession, company_id: str):
    stmt = select(Seat).where(Seat.company_id == company_id)
    result = await db.execute(stmt)
    seats = result.scalars().all()
    
    stmt = select(Company).where(Company.id == company_id)
    result = await db.execute(stmt)
    company = result.scalars().first()
    
    return {
        "seats": seats,
        "available_count": company.max_seats - len([s for s in seats if s.status == 'assigned']),
        "total_count": company.max_seats
    }
