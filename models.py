from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    position = Column(String)
    department = Column(String)
    phone = Column(String)

    # Связь с документами
    documents = relationship("Document", back_populates="executor")


class Manager(Base):
    __tablename__ = "managers"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    position = Column(String)
    department = Column(String)
    phone = Column(String)

    # Связь с документами
    documents = relationship("Document", back_populates="manager")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)  # входящий, исходящий, внутренний
    description = Column(String)
    deadline = Column(Date)
    status = Column(String)  # В работе, Просрочено, Завершено
    executor_id = Column(Integer, ForeignKey("employees.id"))
    manager_id = Column(Integer, ForeignKey("managers.id"))

    # Связь с сотрудником
    executor = relationship("Employee", back_populates="documents")
    # Связь с менеджером
    manager = relationship("Manager", back_populates="documents")
