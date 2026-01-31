from pydantic import BaseModel
from typing import List, Optional, Any

class ManualChunk(BaseModel):
    chunk_id: str
    text: str
    page_start: int
    page_end: int

class AIQuery(BaseModel):
    question: str
    manual_fingerprint: str
    chunks: List[ManualChunk]
    model_numbers: Optional[List[str]] = []

class Citation(BaseModel):
    chunk_id: str
    page_start: int
    page_end: int
    relevance_score: Optional[float] = None

class SuggestedFault(BaseModel):
    type: str # thread, request
    id: str
    title: str
    
class AIAnswer(BaseModel):
    answer: str
    citations: List[Citation]
    suggested_faults: List[SuggestedFault] = []
    confidence: str # high, medium, low
