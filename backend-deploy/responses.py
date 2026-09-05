from typing import Generic, Optional, TypeVar
from pydantic import BaseModel, Field


T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    status: str = Field(default="success")
    data: Optional[T] = Field(default=None)
    error: Optional[str] = Field(default=None)
    request_id: Optional[str] = Field(default=None)


class LoginResponse(BaseModel):
    user: Optional[dict] = None
    device_id: Optional[str] = None
