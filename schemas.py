from pydantic import BaseModel
from datetime import date
from typing import Optional

class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    position: str
    department: str
    phone: str

class EmployeeCreate(EmployeeBase):
    pass

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

class ManagerCreate(ManagerBase):
    pass

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

class DocumentCreate(DocumentBase):
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