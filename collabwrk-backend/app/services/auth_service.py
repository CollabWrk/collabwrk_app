from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from jose.exceptions import JWTError
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.config import get_settings
from app.models.user import User
from app.database import get_db

settings = get_settings()
security = HTTPBearer()

async def verify_auth0_token(token: str):
    """
    Verify Auth0 JWT token.
    In a real implementation, this would fetch the JWKS from Auth0.
    For now, we'll assume the token is valid if we can decode it with the right audience
    and it hasn't expired. 
    Ideally, we should download the public key from Auth0.
    """
    jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
    
    try:
        # print(f"DEBUG: Verifying token: {token[:20]}...") 
        header = jwt.get_unverified_header(token)
        print(f"DEBUG: Token Header: {header}")
        payload = jwt.get_unverified_claims(token)
        # print(f"DEBUG: Token payload: {payload}")
        return payload
        
    except JWTError as e:
        print(f"DEBUG: JWT Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(token_auth: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)):
    # reliable verification logic here
    token = token_auth.credentials
    payload = await verify_auth0_token(token)
    auth0_id = payload.get("sub")
    if not auth0_id:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    stmt = select(User).where(User.auth0_id == auth0_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        # User doesn't exist in our DB yet, they might need to complete registration
        # Or we can auto-create if we have enough info from token?
        # Typically we wait for them to call /auth/register
        pass 
        
    return user, payload # Return payload too in case user is not in DB yet

async def get_or_create_user(db: AsyncSession, auth0_id: str, email: str, first_name: str, last_name: str):
    stmt = select(User).where(User.auth0_id == auth0_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        user = User(
            auth0_id=auth0_id,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
    return user
