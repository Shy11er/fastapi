import React, { useState, useEffect } from "react";
import { Employee } from "../types";
import { updateEmployee, getEmployee } from "../services/api";

interface EmployeeFormProps {
  employeeId: number;
  onEmployeeUpdated: (updatedEmployee: Employee) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employeeId, onEmployeeUpdated }) => {
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployee(employeeId);
        setEmployeeData(data);
      } catch (error) {
        console.error("Ошибка при загрузке данных сотрудника:", error);
      }
    };
    fetchEmployee();
  }, [employeeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (employeeData) {
      setEmployeeData({ ...employeeData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeData) {
      try {
        const updatedEmployee = await updateEmployee(employeeId, employeeData);
        onEmployeeUpdated(updatedEmployee);
      } catch (error) {
        console.error("Ошибка при обновлении сотрудника:", error);
      }
    }
  };

  if (!employeeData) return <div>Загрузка...</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Обновить информацию о сотруднике</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Имя:</label>
        <input
          type="text"
          name="first_name"
          value={employeeData.first_name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Фамилия:</label>
        <input
          type="text"
          name="last_name"
          value={employeeData.last_name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Должность:</label>
        <input
          type="text"
          name="position"
          value={employeeData.position}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Сохранить
      </button>
    </form>
  );
};

export default EmployeeForm;
