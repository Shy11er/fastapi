from sqlalchemy.orm import Session
from models import Employee, Manager, Document
from schemas import EmployeeCreate, ManagerCreate, DocumentCreate
from sqlalchemy.orm import Session
from models import Employee, Manager
import schemas

# Функции для сотрудников
def get_employees(db: Session):
    return db.query(Employee).all()

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_employee = Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

# Получение сотрудника по ID
def get_employee(db: Session, employee_id: int):
    return db.query(Employee).filter(Employee.id == employee_id).first()

# Функции для менеджеров
def get_managers(db: Session):
    return db.query(Manager).all()

def get_manager(db: Session, manager_id: int):
    return db.query(Manager).filter(Manager.id == manager_id).first()


def create_manager(db: Session, manager: schemas.ManagerCreate):
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

def update_employee(db: Session, employee_id: int, employee_data: dict):
    # Получаем сотрудника по ID
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    
    if db_employee:
        # Обновляем только те поля, которые были переданы в employee_data
        for key, value in employee_data.items():
            setattr(db_employee, key, value)
        
        db.commit()  # Сохраняем изменения
        db.refresh(db_employee)  # Обновляем объект сотрудника в памяти
        return db_employee  # Возвращаем обновленного сотрудника
    
    return None  # Если сотрудник не найден, возвращаем None

def update_manager(db: Session, manager_id: int, manager: schemas.ManagerUpdate):
    db_manager = db.query(Manager).filter(Manager.id == manager_id).first()
    if db_manager:
        db_manager.first_name = manager.first_name
        db_manager.last_name = manager.last_name
        db_manager.position = manager.position
        db_manager.department = manager.department
        db_manager.phone = manager.phone  # Обновляем номер телефона
        db.commit()
        db.refresh(db_manager)
        return db_manager
    return None
