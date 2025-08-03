from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ConversationRequest
from gemini_service import GeminiService
from config import settings
import uvicorn

app = FastAPI(
    title="Flert-AI API",
    description="API com personalização de preferências do usuário",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_service = GeminiService()

@app.post("/chat")
async def chat(request: ConversationRequest):
    try:
        user_message = None
        for msg in reversed(request.history):
            if msg.role.lower() == "user":
                user_message = msg.content
                break
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Nenhuma mensagem de usuário encontrada no histórico")
        
        conversation_history = []
        for msg in request.history:
            conversation_history.append({
                "role": msg.role.lower(),
                "content": msg.content
            })
        
        response_text = await gemini_service.generate_response_with_context(
            message=user_message,
            history=conversation_history,
            preferences=request.preferences
        )
        
        return {
            "response": response_text,
            "applied_preferences": {
                "style": request.preferences.style,
                "length": request.preferences.length
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.app_debug
    )