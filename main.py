from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from fastapi.middleware.cors import CORSMiddleware
from models import Document
from datetime import date
from typing import List
import schemas, crud
from schemas import DocumentCreate, DeadlineUpdate
import logging 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/employees/", response_model=List[schemas.Employee])
def read_employees(db: Session = Depends(get_db)):
    employees = crud.get_employees(db)
    return employees

@app.post("/employees/", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    return crud.create_employee(db, employee)

@app.get("/employees/{employee_id}", response_model=schemas.Employee)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    return crud.get_employee(db, employee_id)

@app.put("/employees/{employee_id}")
def update_employee(employee_id: int, employee: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Обновление сотрудника с ID {employee_id}")
        
        # Преобразуем объект Pydantic в словарь
        employee_data = employee.dict(exclude_unset=True)
        
        # Логируем, какие данные получены
        logger.debug(f"Данные для обновления сотрудника: {employee_data}")
        
        db_employee = crud.update_employee(db, employee_id, employee_data)
        
        if db_employee is None:
            logger.error(f"Сотрудник с ID {employee_id} не найден.")
            raise HTTPException(status_code=404, detail="Employee not found")
        
        logger.info(f"Сотрудник с ID {employee_id} успешно обновлен.")
        return db_employee
    except Exception as e:
        logger.exception(f"Ошибка при обновлении сотрудника с ID {employee_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
# Эндпоинты для менеджеров
@app.get("/managers/", response_model=List[schemas.Manager])
def read_managers(db: Session = Depends(get_db)):
    managers = crud.get_managers(db)
    return managers

@app.get("/managers/{manager_id}", response_model=schemas.Employee)
def get_manager(manager_id: int, db: Session = Depends(get_db)):
    return crud.get_manager(db, manager_id)


@app.post("/managers/", response_model=schemas.Manager)
def create_manager(manager: schemas.ManagerCreate, db: Session = Depends(get_db)):
    return crud.create_manager(db, manager)

# Обновить менеджера
@app.put("/managers/{manager_id}", response_model=schemas.Manager)
def update_manager(manager_id: int, manager: schemas.ManagerUpdate, db: Session = Depends(get_db)):
    db_manager = crud.get_manager(db, manager_id)
    if not db_manager:
        raise HTTPException(status_code=404, detail="Manager not found")
    return crud.update_manager(db, manager_id, manager)


@app.post("/documents/")
def add_document(document: DocumentCreate, db: Session = Depends(get_db)):
    # Определяем статус в зависимости от срока исполнения
    if document.deadline and document.deadline < date.today():
        status = "Просрочено"
    else:
        status = "В работе"
    
    # Создаём экземпляр документа с учётом статуса
    db_document = Document(
        type=document.type,
        description=document.description,
        deadline=document.deadline,
        status=status,
        executor_id=document.executor_id,
        manager_id=document.manager_id,
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document


@app.get("/documents/status/{status}")
def get_documents_by_status(status: str, db: Session = Depends(get_db)):
    documents = db.query(Document).filter(Document.status == status).all()
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

@app.put("/documents/{document_id}/deadline/")
def update_document_deadline(document_id: int, update: DeadlineUpdate, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Документ не найден")
    
    document.deadline = update.deadline
    db.commit()
    db.refresh(document)
    return document

@app.patch("/documents/{document_id}/update-executor")
def update_executor(document_id: int, new_executor_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Документ не найден")
    document.executor_id = new_executor_id
    db.commit()
    db.refresh(document)
    return document

@app.get("/documents/")
def get_all_documents(db: Session = Depends(get_db)):
    return db.query(Document).all()
