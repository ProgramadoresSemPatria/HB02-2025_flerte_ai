from pydantic import BaseModel
from typing import List

class MessageHistory(BaseModel):
    role: str
    content: str

class UserPreferences(BaseModel):
    style: str
    length: str

class ConversationRequest(BaseModel):
    history: List[MessageHistory]
    preferences: UserPreferences

