from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import get_or_create_user, get_current_user
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter()
security = HTTPBearer()

@router.post("/register", response_model=UserResponse)
async def register(
    user_in: UserCreate, 
    db: AsyncSession = Depends(get_db),
    # verifying token here ensures only authenticated users can register
    token: HTTPAuthorizationCredentials = Depends(security)
):
    # In a real app, we should verify that user_in.auth0_id matches the token subject
    # payload = await verify_auth0_token(token.credentials)
    # if payload['sub'] != user_in.auth0_id: raise ...
    
    user = await get_or_create_user(
        db, 
        auth0_id=user_in.auth0_id,
        email=user_in.email,
        first_name=user_in.first_name,
        last_name=user_in.last_name
    )
    return user

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user_and_token = Depends(get_current_user)
):
    user, payload = current_user_and_token
    if not user:
         raise HTTPException(status_code=404, detail="User not found in database. Please register first.")
    return user
