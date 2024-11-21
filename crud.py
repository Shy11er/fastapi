from sqlalchemy.orm import Session
from models import Employee, Manager, Document
from schemas import EmployeeCreate, ManagerCreate, DocumentCreate

def create_employee(db: Session, employee: EmployeeCreate):
    db_employee = Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def create_manager(db: Session, manager: ManagerCreate):
    db_manager = Manager(**manager.dict())
    db.add(db_manager)
    db.commit()
    db.refresh(db_manager)
    return db_manager

def create_document(db: Session, document: DocumentCreate):
    db_document = Document(**document.dict())
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

def get_documents_by_status(db: Session, status: str):
    return db.query(Document).filter(Document.status == status).all()
