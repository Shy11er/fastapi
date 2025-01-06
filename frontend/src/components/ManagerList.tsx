import React, { useState, useEffect } from "react";
import { Manager } from "../types";
import { getManagers } from "../services/api";

interface ManagerListProps {
  onEditManager: (id: number) => void; // Добавляем обработчик для редактирования менеджера
}

const ManagerList: React.FC<ManagerListProps> = ({ onEditManager }) => {
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const data = await getManagers();
        setManagers(data);
      } catch (error) {
        console.error("Ошибка при загрузке менеджеров:", error);
      }
    };

    fetchManagers();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full">
      <h2 className="text-2xl font-semibold mb-4">Список менеджеров</h2>
      {managers.length > 0 ? (
        <ul>
          {managers.map((manager) => (
            <li key={manager.id} className="mb-2">
              <strong>{manager.first_name} {manager.last_name}</strong> - {manager.position}
              <br />
              Отдел: {manager.department}
              <br />
              Телефон: {manager.phone}
              <button
                onClick={() => onEditManager(manager.id)} // При клике вызываем onEditManager
                className="ml-4 text-blue-500"
              >
                Редактировать
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет менеджеров для отображения.</p>
      )}
    </div>
  );
};

export default ManagerList;
