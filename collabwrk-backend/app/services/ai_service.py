import json
from typing import List
from openai import AsyncOpenAI
from app.config import get_settings
from app.schemas.ai import ManualChunk, AIAnswer, Citation, SuggestedFault

settings = get_settings()
client = AsyncOpenAI(
    base_url=settings.OPENAI_BASE_URL,
    api_key=settings.OPENROUTER_API_KEY,
    default_headers={
        "HTTP-Referer": "https://collabwrk.app", # Optional, for including your app on openrouter.ai rankings.
        "X-Title": "CollabWrk", # Optional. Shows in rankings on openrouter.ai.
    }
)

async def generate_answer(question: str, chunks: List[ManualChunk], model_numbers: List[str]) -> AIAnswer:
    # Format chunks for the prompt
    chunks_text = "\n\n".join([
        f"Chunk ID: {chunk.chunk_id}\nText: {chunk.text}\nPage Range: {chunk.page_start}-{chunk.page_end}"
        for chunk in chunks
    ])
    
    system_prompt = """
    You are a technical manual assistant for field technicians. Answer the question using ONLY the provided manual excerpts.
    
    STRICT RULES:
    1. Use ONLY information from the provided chunks. Do not use outside knowledge.
    2. Always cite the Chunk ID for each fact you state.
    3. If the answer is not in the chunks, respond only with: "NOT_FOUND" in the answer field.
    4. Provide the output in strictly valid JSON format matching the schema.
    
    Output JSON Schema:
    {
      "answer": "string",
      "citations": [
        {"chunk_id": "string", "page_start": int, "page_end": int, "relevance_score": float}
      ],
      "confidence": "high" | "medium" | "low",
      "suggested_faults": []
    }
    """
    
    user_message = f"""
    Question: {question}
    Model Numbers: {", ".join(model_numbers)}
    
    Manual Excerpts:
    {chunks_text}
    """
    
    try:
        response = await client.chat.completions.create(
            model=settings.AI_MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        # Handle NOT_FOUND case
        if data.get("answer") == "NOT_FOUND":
            return AIAnswer(
                answer="This information is not found in the provided manual sections. Consider posting a request to the community.",
                citations=[],
                confidence="low",
                suggested_faults=[]
            )
            
        return AIAnswer(**data)
        
    except Exception as e:
        print(f"Error generating AI answer: {e}")
        # Fallback
        return AIAnswer(
            answer="I encountered an error analyzing the manual. Please try again.",
            citations=[],
            confidence="low"
        )

async def get_suggested_faults(model_numbers: List[str], manual_fingerprint: str):
    # This would query the DB for solved requests
    # Mock implementation for now
    return []
