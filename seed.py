from sqlalchemy.orm import Session
from database import engine, Base
from models import Employee, Manager, Document
from datetime import date

# Создаем все таблицы, если их еще нет
Base.metadata.create_all(bind=engine)

# Функция для заполнения базы данных
def seed_data():
    # Подключение к базе данных
    with Session(engine) as session:
        # Добавляем сотрудников
        employees = [
            Employee(first_name="Иван", last_name="Иванов", position="Инженер", department="Отдел разработки", phone="123456789"),
            Employee(first_name="Петр", last_name="Петров", position="Аналитик", department="Отдел аналитики", phone="987654321"),
        ]
        session.add_all(employees)

        # Добавляем менеджеров
        managers = [
            Manager(first_name="Сергей", last_name="Сергеев", position="Руководитель", department="Управление проектами", phone="1122334455"),
            Manager(first_name="Ольга", last_name="Ольгина", position="Менеджер", department="Маркетинг", phone="5566778899"),
        ]
        session.add_all(managers)

        # Добавляем документы
        documents = [
            Document(
                type="входящий",
                description="Документ о поставке",
                deadline=date(2024, 11, 30),
                status="В работе",
                executor_id=1,
                manager_id=1,
            ),
            Document(
                type="исходящий",
                description="Отчет о проекте",
                deadline=date(2024, 12, 15),
                status="Просрочено",
                executor_id=2,
                manager_id=2,
            ),
        ]
        session.add_all(documents)

        # Сохраняем изменения
        session.commit()

if __name__ == "__main__":
    seed_data()
    print("База данных заполнена тестовыми данными!")
