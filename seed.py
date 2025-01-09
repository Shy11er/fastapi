from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import engine, SessionLocal
from models import Employee, Department, Position

# Контекст для хэширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Данные для отделов и должностей
departments_data = [
    {"name": "Закупки"},
    {"name": "Склад"},
    {"name": "Продажи"},
]

positions_data = [
    {"name": "Менеджер по закупкам"},
    {"name": "Кладовщик"},
    {"name": "Менеджер по продажам"},
]

def seed_data():
    db: Session = SessionLocal()
    try:
        # Добавляем отделы
        for department in departments_data:
            existing = db.query(Department).filter(Department.name == department["name"]).first()
            if not existing:
                db.add(Department(**department))

        # Добавляем должности
        for position in positions_data:
            existing = db.query(Position).filter(Position.name == position["name"]).first()
            if not existing:
                db.add(Position(**position))

        # Добавляем аккаунт администратора
        admin_exists = db.query(Employee).filter(Employee.phone == "1").first()
        if not admin_exists:
            admin = Employee(
                first_name="Админ",
                last_name="Администратор",
                phone="1",
                password=pwd_context.hash("admin"),  # Хэшируем пароль
                role="admin",
                department_id=None,  # Админ не привязан к отделу
                position_id=None,    # Админ не привязан к должности
            )
            db.add(admin)

        db.commit()
        print("Данные успешно добавлены в базу.")
    except Exception as e:
        print(f"Ошибка при заполнении базы данных: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
