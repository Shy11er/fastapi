from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from database import Base
from enum import Enum as PyEnum

class Role(PyEnum):
    EMPLOYEE = "employee"
    MANAGER = "manager"
    ADMIN = "admin"

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    position = Column(String)
    department = Column(String)
    phone = Column(String)
    role = Column(Enum(Role), default=Role.EMPLOYEE)

    documents = relationship("Document", back_populates="executor")
    
    department_id = Column(Integer, ForeignKey("departments.id"))
    department = relationship("Department", back_populates="employees")

    position_id = Column(Integer, ForeignKey("positions.id"))
    position = relationship("Position", back_populates="employees")

class Manager(Base):
    __tablename__ = "managers"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    position = Column(String)
    department = Column(String)
    phone = Column(String)
    role = Column(Enum(Role), default=Role.MANAGER)

    documents = relationship("Document", back_populates="manager")
    
class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    description = Column(String)
    deadline = Column(Date)
    status = Column(String)
    executor_id = Column(Integer, ForeignKey("employees.id"))
    manager_id = Column(Integer, ForeignKey("managers.id"))

    # Связь с сотрудником
    executor = relationship("Employee", back_populates="documents")
    # Связь с менеджером
    manager = relationship("Manager", back_populates="documents")

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    class Config:
        orm_mode = True

class Position(Base):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    class Config:
        orm_mode = True
        