from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.company import CompanyCreate, CompanyResponse, InviteCode, CompanySeatsResponse
from app.services.company_service import create_company, join_company, get_company_seats
from app.services.auth_service import get_current_user

router = APIRouter()

@router.post("/create", response_model=CompanyResponse)
async def create_new_company(
    company_in: CompanyCreate,
    db: AsyncSession = Depends(get_db),
    current_user_and_token = Depends(get_current_user)
):
    user, _ = current_user_and_token
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    company = await create_company(
        db, 
        name=company_in.name, 
        creator_id=user.id,
        max_seats=company_in.max_seats
    )
    return company

@router.post("/join", response_model=CompanyResponse)
async def join_existing_company(
    invite: InviteCode,
    db: AsyncSession = Depends(get_db),
    current_user_and_token = Depends(get_current_user)
):
    user, _ = current_user_and_token
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    company = await join_company(db, user_id=user.id, invite_code=invite.invite_code)
    return company

@router.get("/seats", response_model=CompanySeatsResponse)
async def read_company_seats(
    db: AsyncSession = Depends(get_db),
    current_user_and_token = Depends(get_current_user)
):
    user, _ = current_user_and_token
    if not user or not user.company_id:
        raise HTTPException(status_code=400, detail="User does not belong to a company")
        
    seats_data = await get_company_seats(db, company_id=user.company_id)
    return seats_data
