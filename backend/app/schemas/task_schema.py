# FILE: app/schemas/task_schema.py

from pydantic import BaseModel
from typing import Optional


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str
    date: str
    status: Optional[str] = "todo"

    # FILE SUPPORT
    file: Optional[str] = None              # Base64 content
    file_name: Optional[str] = None         # Stored name
    original_file_name: Optional[str] = None  # Original file name


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    date: Optional[str] = None
    status: Optional[str] = None

    # FILE SUPPORT
    file: Optional[str] = None
    file_name: Optional[str] = None
    original_file_name: Optional[str] = None
