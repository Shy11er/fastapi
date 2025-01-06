import React, { useState, useEffect } from "react";
import { Employee } from "../types";
import { getEmployees } from "../services/api";

interface EmployeeListProps {
  onEditEmployee: (id: number) => void; // Добавляем обработчик для редактирования сотрудника
}

const EmployeeList: React.FC<EmployeeListProps> = ({ onEditEmployee }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Ошибка при загрузке сотрудников:", error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full">
      <h2 className="text-2xl font-semibold mb-4">Список сотрудников</h2>
      {employees.length > 0 ? (
        <ul>
          {employees.map((employee) => (
            <li key={employee.id} className="mb-2">
              <strong>{employee.first_name} {employee.last_name}</strong> - {employee.position}
              <br />
              Отдел: {employee.department}
              <br />
              Телефон: {employee.phone}
              <button
                onClick={() => onEditEmployee(employee.id)} // При клике вызываем onEditEmployee
                className="ml-4 text-blue-500"
              >
                Редактировать
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет сотрудников для отображения.</p>
      )}
    </div>
  );
};

export default EmployeeList;
