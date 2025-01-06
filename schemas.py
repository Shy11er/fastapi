from datetime import date
from typing import Optional
from pydantic import BaseModel
from datetime import date

class DeadlineUpdate(BaseModel):
    deadline: date

class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    position: str
    department: str
    phone: str

class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    position: str
    department: str
    phone: str

class EmployeeUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    position: str | None = None
    department: str | None = None
    phone: str | None = None

class Employee(BaseModel):
    id: int
    first_name: str
    last_name: str
    position: str
    department: str
    phone: str

    class Config:
        from_attributes = True

class ManagerBase(BaseModel):
    first_name: str
    last_name: str
    position: str
    department: str
    phone: str

class ManagerCreate(BaseModel):
    first_name: str
    last_name: str
    position: str
    department: str
    phone: str

class ManagerUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    position: str | None = None
    department: str | None = None
    phone: str | None = None


class Manager(BaseModel):
    id: int
    first_name: str
    last_name: str
    position: str
    department: str
    phone: str

    class Config:
        from_attributes = True

class DocumentBase(BaseModel):
    type: str
    description: str
    deadline: date
    status: str

class DocumentCreate(BaseModel):
    type: str
    description: str
    deadline: date
    executor_id: int
    manager_id: int

class Document(BaseModel):
    id: int
    type: str
    description: str
    deadline: date
    status: str
    executor: Optional[Employee]
    manager: Optional[Manager]

    class Config:
        from_attributes = True
