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
    phone: str
    password: str
    department: int
    position: int

class EmployeeUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    position_id: int | None = None
    department_id: int | None = None
    phone: str | None = None

class Employee(BaseModel):
    id: int
    first_name: str
    last_name: str
    position_id: Optional[int]
    department_id: Optional[int]
    phone: str

    class Config:
        orm_mode = True

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

class Department(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class Position(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
        
class LoginRequest(BaseModel):
    phone: str
    password: str