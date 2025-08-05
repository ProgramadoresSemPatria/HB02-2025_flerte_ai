from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from schemas.models import ConversationRequest
from services.gemini_service import GeminiService
from PIL import Image
import io

router = APIRouter(prefix="/chat", tags=["chat"])
gemini_service = GeminiService()

def optimize_image(image_bytes: bytes) -> bytes:
    try:
        max_size = (1024, 1024)
        buffer = io.BytesIO(image_bytes)
        img = Image.open(buffer)
        
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        output_buffer = io.BytesIO()
        img.save(output_buffer, format="JPEG", quality=85)
        return output_buffer.getvalue()
    except Exception as e:
        print(f"Erro ao otimizar a imagem: {e}")
        return image_bytes

@router.post("/with-image")
async def chat_with_image(
    image: UploadFile = File(...),
    request_data: str = Form(...)
):
    try:
        request = ConversationRequest.model_validate_json(request_data)

        image_bytes = await image.read()
        optimized_image_bytes = optimize_image(image_bytes)
        
        user_message_found = False
        for msg in reversed(request.history):
            if msg.role.lower() == "user":
                msg.image_data = optimized_image_bytes
                user_message_found = True
                break
        
        if not user_message_found:
            raise HTTPException(status_code=400, detail="Nenhuma mensagem de usuário encontrada no histórico para anexar a imagem.")

        conversation_history = []
        for msg in request.history:
            history_item = {
                "role": msg.role.lower(),
                "content": msg.content
            }
            if msg.image_data:
                history_item["image_data"] = msg.image_data
            conversation_history.append(history_item)
            
        response_text = await gemini_service.generate_response_with_context(
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