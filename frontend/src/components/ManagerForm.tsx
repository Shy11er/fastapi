import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getManager, updateEmployee } from "../services/api";
import { Manager } from "../types";

interface ManagerFormProps {
    managerId: number;
    onManagerUpdated: (updatedManager: Manager) => void;
}

const ManagerForm: React.FC<ManagerFormProps> = ({
    managerId,
    onManagerUpdated,
}) => {
    const [managerData, setManagerData] = useState<Manager | null>(null);

    useEffect(() => {
        const fetchManager = async () => {
            try {
                const data = await getManager(managerId);
                setManagerData(data);
            } catch (error) {
                console.error("Ошибка при загрузке данных менеджера:", error);
            }
        };
        fetchManager();
    }, [managerId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (managerData) {
            setManagerData({ ...managerData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (managerData) {
            try {
                const updatedManager = await updateEmployee(
                    managerId,
                    managerData
                );
                onManagerUpdated(updatedManager);
                toast.success("Даннные менеджера успешно обновлены");
            } catch (error) {
                console.error("Ошибка при обновлении менеджера:", error);
                toast.success("Ошибка при обновлении менеджера");
            }
        }
    };

    if (!managerData) return <div>Загрузка...</div>;

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-lg p-6"
        >
            <h2 className="text-2xl font-semibold mb-4">
                Обновить информацию о менеджере
            </h2>

            <div className="mb-4">
                <label className="block text-gray-700">Имя:</label>
                <input
                    type="text"
                    name="first_name"
                    value={managerData.first_name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Фамилия:</label>
                <input
                    type="text"
                    name="last_name"
                    value={managerData.last_name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Должность:</label>
                <input
                    type="text"
                    name="position"
                    value={managerData.position}
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

export default ManagerForm;
