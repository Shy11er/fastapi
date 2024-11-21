from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from schemas import EmployeeCreate, ManagerCreate, DocumentCreate
from crud import create_employee, create_manager, create_document, get_documents_by_status
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from models import Employee, Manager, Document

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Можно указать конкретные домены для безопасности
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создание таблиц
Base.metadata.create_all(bind=engine)

@app.post("/employees/")
def add_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    return create_employee(db, employee)

@app.post("/managers/")
def add_manager(manager: ManagerCreate, db: Session = Depends(get_db)):
    return create_manager(db, manager)

@app.post("/documents/")
def add_document(document: DocumentCreate, db: Session = Depends(get_db)):
    return create_document(db, document)

@app.get("/documents/status/{status}")
def get_documents(status: str, db: Session = Depends(get_db)):
    documents = get_documents_by_status(db, status)
    if not documents:
        raise HTTPException(status_code=404, detail="Documents not found")
    return documents


@app.patch("/documents/{document_id}/complete")
def mark_document_complete(document_id: int, db: Session = Depends(get_db)):
    # Находим документ
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Документ не найден")

    # Обновляем статус
    document.status = "Завершено"
    db.commit()
    db.refresh(document)
    return {"message": "Документ завершён", "document": document.id}