import React, { useEffect, useState } from "react";
import axios from "axios";
import {getEmployees, getManagers, addDocument} from "../services/api";

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
}

interface Manager {
  id: number;
  first_name: string;
  last_name: string;
}

const DocumentForm: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [formData, setFormData] = useState({
    type: "входящий",
    description: "",
    deadline: "",
    executor_id: "",
    manager_id: "",
  });

  // Загрузка сотрудников и менеджеров
  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await getEmployees();
      setEmployees(response);
    };

    const fetchManagers = async () => {
      const response = await getManagers();
      setManagers(response);
    };

    fetchEmployees();
    fetchManagers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDocument(formData);
      alert("Документ добавлен!");
    } catch (error) {
      console.error("Ошибка при добавлении документа:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Добавить документ</h2>

      {/* Тип документа */}
      <div className="mb-4">
        <label className="block text-gray-700">Тип документа:</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 mt-1"
        >
          <option value="входящий">Входящий</option>
          <option value="исходящий">Исходящий</option>
          <option value="внутренний">Внутренний</option>
        </select>
      </div>

      {/* Описание */}
      <div className="mb-4">
        <label className="block text-gray-700">Описание:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      {/* Срок выполнения */}
      <div className="mb-4">
        <label className="block text-gray-700">Срок выполнения:</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      {/* Исполнитель */}
      <div className="mb-4">
        <label className="block text-gray-700">Исполнитель:</label>
        <select
          name="executor_id"
          value={formData.executor_id}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 mt-1"
        >
          <option value="">Выберите исполнителя</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.first_name} {employee.last_name}
            </option>
          ))}
        </select>
      </div>

      {/* Руководитель */}
      <div className="mb-4">
        <label className="block text-gray-700">Руководитель:</label>
        <select
          name="manager_id"
          value={formData.manager_id}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 mt-1"
        >
          <option value="">Выберите руководителя</option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.first_name} {manager.last_name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Добавить
      </button>
    </form>
  );
};

export default DocumentForm;
