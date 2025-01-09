from fastapi import FastAPI, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from fastapi.middleware.cors import CORSMiddleware
from models import Document, Position, Department, Employee
from datetime import date
from typing import List
import schemas, crud
from schemas import DocumentCreate, DeadlineUpdate, EmployeeCreate
import logging 
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from schemas import Department as DepartmentSchema
from schemas import Position as PositionSchema
from schemas import LoginRequest
import hmac
import base64
import hashlib
import time
import json
from passlib.context import CryptContext

# Инициализация контекста для хэширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
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

security = HTTPBearer()

def get_current_role(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    print(1, token)
    if token == "admin_token":
        return "admin"
    elif token == "manager_token":
        return "manager"
    elif token == "employee_token":
        return "employee"
    else:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/employees/", response_model=List[schemas.Employee])
def get_employees(db: Session = Depends(get_db)):
    employees = crud.get_employees(db)
    return employees

@app.get("/employees/{employee_id}", response_model=schemas.Employee)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    return crud.get_employee(db, employee_id)

@app.put("/employees/{employee_id}")
def update_employee(employee_id: int, employee: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    try:
        db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not db_employee:
            raise HTTPException(status_code=404, detail="Сотрудник не найден")

        # Обновляем поля
        for field, value in employee.dict(exclude_unset=True).items():
            setattr(db_employee, field, value)

        db.commit()
        db.refresh(db_employee)
        return db_employee
    except Exception as e:
        logger.exception(f"Ошибка при обновлении сотрудника с ID {employee_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
 
@app.delete("/employees/{id}")
def delete_manager(id: int, db: Session = Depends(get_db)):
    manager = db.query(Employee).filter(Employee.id == id).first()
    if not manager:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    
    db.delete(manager)
    db.commit()
    return {"message": f"Менеджер с ID {id} успешно удален"}

    
# Эндпоинты для менеджеров
@app.get("/managers/", response_model=List[schemas.Employee])
def get_managers(db: Session = Depends(get_db)):
    managers = crud.get_managers(db)
    return managers

@app.get("/managers/{manager_id}", response_model=schemas.Employee)
def get_manager(manager_id: int, db: Session = Depends(get_db)):
    return crud.get_manager(db, manager_id)

# Обновить менеджера
@app.put("/managers/{manager_id}", response_model=schemas.Manager)
def update_manager(manager_id: int, manager: schemas.ManagerUpdate, db: Session = Depends(get_db)):
    db_manager = crud.get_manager(db, manager_id)
    if not db_manager:
        raise HTTPException(status_code=404, detail="Manager not found")
    return crud.update_manager(db, manager_id, manager)

@app.post("/documents/")
def add_document(document: DocumentCreate, db: Session = Depends(get_db)):
    # Проверка существования исполнителя
    executor = db.query(Employee).filter(Employee.id == document.executor_id).first()
    if not executor:
        raise HTTPException(status_code=404, detail="Исполнитель не найден")
    
    # Проверка существования менеджера
    manager = db.query(Employee).filter(Employee.id == document.manager_id, Employee.role == "manager").first()
    if not manager:
        raise HTTPException(status_code=404, detail="Менеджер не найден")

    # Определяем статус в зависимости от срока исполнения
    status = "Просрочено" if document.deadline and document.deadline < date.today() else "В работе"

    # Создаём экземпляр документа
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
def mark_document_complete(
    document_id: int,
    db: Session = Depends(get_db),
):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Документ не найден")

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
    document.status = "Просрочено" if document.deadline and document.deadline < date.today() else "В работе"
    
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

@app.get("/departments/", response_model=List[DepartmentSchema])
def get_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()

@app.get("/positions/", response_model=List[PositionSchema])
def get_positions(db: Session = Depends(get_db)):
    return db.query(Position).all()

SECRET_KEY = "asndhljabsjlfb"
ALGORITHM = "HS256"

def generate_token(data: dict, secret_key: str, algorithm: str = "HS256", exp_minutes: int = 30) -> str:
    header = {"alg": algorithm, "typ": "JWT"}
    payload = data.copy()
    payload["exp"] = int(time.time()) + exp_minutes * 60

    def encode(data):
        return base64.urlsafe_b64encode(data.encode()).decode().rstrip("=")

    header_encoded = encode(json.dumps(header))
    payload_encoded = encode(json.dumps(payload))
    signature = hmac.new(
        secret_key.encode(),
        f"{header_encoded}.{payload_encoded}".encode(),
        hashlib.sha256,
    ).digest()
    signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip("=")

    return f"{header_encoded}.{payload_encoded}.{signature_encoded}"


def verify_token(token: str, secret_key: str) -> dict:
    try:
        header_encoded, payload_encoded, signature_encoded = token.split(".")
        signature = hmac.new(
            secret_key.encode(),
            f"{header_encoded}.{payload_encoded}".encode(),
            hashlib.sha256,
        ).digest()
        signature_check = base64.urlsafe_b64encode(signature).decode().rstrip("=")

        if signature_check != signature_encoded:
            raise HTTPException(status_code=401, detail="Invalid token signature")

        payload = json.loads(base64.urlsafe_b64decode(payload_encoded + "==").decode())
        if payload["exp"] < int(time.time()):
            raise HTTPException(status_code=401, detail="Token has expired")

        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.post("/login/")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Employee).filter(Employee.phone == data.phone).first()
    if not user or not pwd_context.verify(data.password, user.password):
        raise HTTPException(status_code=401, detail="Неверный номер телефона или пароль")

    token = generate_token({"sub": user.role, "id": user.id}, SECRET_KEY)
    return {"access_token": token, "token_type": "bearer"}

@app.post("/register/")
def register_user(employee: EmployeeCreate, db: Session = Depends(get_db)):
    existing_user = db.query(Employee).filter(Employee.phone == employee.phone).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь с таким номером телефона уже существует")

    hashed_password = pwd_context.hash(employee.password)
    new_employee = Employee(
        first_name=employee.first_name,
        last_name=employee.last_name,
        phone=employee.phone,
        password=hashed_password,
        role="employee",
        department_id=employee.department,
        position_id=employee.position,
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    token = generate_token({"sub": new_employee.role, "id": new_employee.id}, SECRET_KEY)
    return {"access_token": token, "token_type": "bearer"}

@app.post("/employees/{employee_id}/promote")
def promote_to_manager(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")

    employee.role = "manager"
    db.commit()
    db.refresh(employee)
    return {"message": "Сотрудник повышен до менеджера"}
