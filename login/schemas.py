from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class PasswordUpdateRequest(BaseModel):
    old_password: str
    new_password: str

class EmailUpdateRequest(BaseModel):
    new_email: str
