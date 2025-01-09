from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from database import Base
from enum import Enum as PyEnum

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    # Связь с сотрудниками
    employees = relationship("Employee", back_populates="department")


class Position(Base):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    # Связь с сотрудниками
    employees = relationship("Employee", back_populates="position")


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)

    executor_documents = relationship(
        "Document",
        foreign_keys="Document.executor_id",
        back_populates="executor"
    )

    manager_documents = relationship(
        "Document",
        foreign_keys="Document.manager_id",
        back_populates="manager"
    )

    # Связь с отделом
    department_id = Column(Integer, ForeignKey("departments.id"))
    department = relationship("Department", back_populates="employees")

    # Связь с должностью
    position_id = Column(Integer, ForeignKey("positions.id"))
    position = relationship("Position", back_populates="employees")
    
class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    description = Column(String)
    deadline = Column(Date)
    status = Column(String)

    executor_id = Column(Integer, ForeignKey("employees.id"))
    manager_id = Column(Integer, ForeignKey("employees.id"))

    executor = relationship(
        "Employee",
        foreign_keys=[executor_id],
        back_populates="executor_documents"
    )

    manager = relationship(
        "Employee",
        foreign_keys=[manager_id],
        back_populates="manager_documents"
    )
