from sqlalchemy.orm import Session
from models import Employee, Document
from schemas import DocumentCreate

# Функции для сотрудников
def get_employees(db: Session):
    return db.query(Employee).where(Employee.role == "employee").all()

# Получение сотрудника по ID
def get_employee(db: Session, employee_id: int):
    return db.query(Employee).filter(Employee.id == employee_id).first()

# Функции для менеджеров
def get_managers(db: Session):
    return db.query(Employee).where(Employee.role == "manager").all()

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
