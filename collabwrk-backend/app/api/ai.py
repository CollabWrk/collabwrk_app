from fastapi import APIRouter, Depends, HTTPException
from app.schemas.ai import AIQuery, AIAnswer
from app.services.ai_service import generate_answer
from app.services.auth_service import get_current_user

router = APIRouter()

@router.post("/answer", response_model=AIAnswer)
async def ask_manual(
    query: AIQuery,
    current_user_and_token = Depends(get_current_user)
):
    # Depending on requirements, we might allow unauthenticated use for basic features,
    # but for saving cost, let's enforce auth.
    user, _ = current_user_and_token
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    answer = await generate_answer(
        question=query.question, 
        chunks=query.chunks, 
        model_numbers=query.model_numbers
    )
    
    return answer
