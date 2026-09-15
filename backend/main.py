import os
import logging
from typing import List, Optional, Dict, Any, Union
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("edupath_ai_backend")

try:
    from backend.services.gemini_service import gemini_service
except ModuleNotFoundError:
    from services.gemini_service import gemini_service

app = FastAPI(
    title="EduPath AI Doubt Solver Backend",
    description="Backend service interfacing with Google Gemini API for EduPath AI",
    version="2.0.0"
)

# CORS Middleware configuration
cors_origins_env = os.getenv("CORS_ORIGINS", "*").strip()
if cors_origins_env and cors_origins_env != "*":
    allowed_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
else:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Data Schemas matching Section 7 spec
class StudentContext(BaseModel):
    course: Optional[str] = None
    year: Optional[Union[int, str]] = None
    semester: Optional[Union[int, str]] = None
    subject: Optional[str] = None
    unit: Optional[str] = None
    topic: Optional[str] = None

class ChatMessageItem(BaseModel):
    role: str
    content: str

class AIChatRequest(BaseModel):
    message: str = Field(..., max_length=10000)
    context: Optional[StudentContext] = None
    conversation: Optional[List[ChatMessageItem]] = []

class AIChatResponse(BaseModel):
    success: bool
    answer: str
    model: str
    contextUsed: bool

@app.get("/")
def root_endpoint():
    return {
        "status": "online",
        "service": "EduPath AI Backend API",
        "health": "/health",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "EduPath AI Backend",
        "hasGeminiKey": gemini_service.is_configured(),
        "modelConfigured": gemini_service.model
    }

@app.post("/api/ai/chat", response_model=AIChatResponse)
async def ai_chat_endpoint(req: AIChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    # Convert context Pydantic model to dict
    ctx_dict = req.context.model_dump() if req.context else None
    
    # Convert conversation Pydantic items to dicts
    conv_list = [item.model_dump() for item in req.conversation] if req.conversation else []

    # Call Gemini service
    res = gemini_service.generate_chat_response(
        user_message=req.message.strip(),
        conversation_history=conv_list,
        context=ctx_dict
    )

    return AIChatResponse(
        success=res["success"],
        answer=res["answer"],
        model=res["model"],
        contextUsed=res.get("contextUsed", False)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
