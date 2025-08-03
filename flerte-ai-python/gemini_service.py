import google.generativeai as genai
from config import settings
from models import UserPreferences

class GeminiService:
    def __init__(self):
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY não encontrada")
        
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    
    async def generate_response_with_context(
        self,
        message: str,
        history: list,
        preferences: UserPreferences
    ) -> str:
        try:
            system_prompt = f"""
            Você é Flert-AI, um assistente especialista em relacionamentos e comunicação.
            
            CONFIGURAÇÕES DE PERSONALIZAÇÃO:
            - Estilo: {preferences.style}
            - Tamanho: {preferences.length}
            
            DIRETRIZES:
            - Forneça conselhos práticos e respeitosos
            - Promova comunicação saudável e consensual
            - Adapte o tom conforme o estilo definido ({preferences.style})
            - Respeite o tamanho de resposta solicitado ({preferences.length})
            """
            
            history_text = ""
            for msg in history:
                role = "Usuário" if msg["role"] == "user" else "Assistente"
                history_text += f"{role}: {msg['content']}\n"
            
            full_prompt = f"{system_prompt}\n\nHISTÓRICO DA CONVERSA:\n{history_text}\n\nResponda de forma contextual à conversa:"
            
            response = self.model.generate_content(full_prompt)
            return response.text
            
        except Exception as e:
            raise Exception(f"Erro ao gerar resposta do Gemini: {str(e)}")