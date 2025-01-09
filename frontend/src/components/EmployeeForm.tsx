import React, { useEffect, useState } from "react";
import {
    getDepartments,
    getEmployee,
    getPositions,
    updateEmployee,
} from "../services/api";
import { Employee } from "../types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EmployeeFormProps {
    employeeId: number;
    onEmployeeUpdated: (updatedEmployee: Employee) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
    employeeId,
    onEmployeeUpdated,
}) => {
    const [employeeData, setEmployeeData] = useState<Employee | null>(null);
    const [departments, setDepartments] = useState<
        { id: number; name: string }[]
    >([]);
    const [positions, setPositions] = useState<{ id: number; name: string }[]>(
        []
    );

    const fetchEmployee = async () => {
        try {
            const data = await getEmployee(employeeId);
            setEmployeeData(data);
        } catch (error) {
            console.error("Ошибка при загрузке данных сотрудника:", error);
        }
    };

    useEffect(() => {
        const fetchDepartments = async () => {
            const data = await getDepartments();
            setDepartments(data);
        };

        const fetchPositions = async () => {
            const data = await getPositions();
            setPositions(data);
        };

        fetchDepartments();
        fetchPositions();
        fetchEmployee();
    }, [employeeId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        const newValue =
            name === "department_id" || name === "position_id"
                ? parseInt(value, 10)
                : value;

        if (employeeData) {
            setEmployeeData({ ...employeeData, [name]: newValue });
            console.log(employeeData);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (employeeData) {
            try {
                const updatedEmployee = await updateEmployee(
                    employeeId,
                    employeeData
                );
                onEmployeeUpdated(updatedEmployee);
                fetchEmployee();
                toast.success("Информация о сотруднике успешно изменена!");
            } catch (error) {
                console.error("Ошибка при обновлении сотрудника:", error);
                toast.error("Ошибка при обновлении сотрудника")
            }
        }
    };

    if (!employeeData) return <div>Загрузка...</div>;

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-lg p-6"
        >
            <h2 className="text-2xl font-semibold mb-4">
                Обновить информацию о сотруднике
            </h2>

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
                <label className="block text-gray-700">Телефон:</label>
                <input
                    type="text"
                    name="phone"
                    value={employeeData.phone}
                    onChange={(e) => {
                        const sanitizedValue = e.target.value.replace(
                            /\D/g,
                            ""
                        ); // Только числа
                        setEmployeeData({
                            ...employeeData,
                            phone: sanitizedValue,
                        });
                    }}
                    className="w-full border rounded px-3 py-2 mt-1"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Департамент:</label>
                <select
                    name="department_id"
                    value={employeeData.department_id}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                >
                    <option value="">Выберите департамент</option>
                    {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Должность:</label>
                <select
                    name="position_id"
                    value={employeeData.position_id}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                >
                    <option value="">Выберите должность</option>
                    {positions.map((position) => (
                        <option key={position.id} value={position.id}>
                            {position.name}
                        </option>
                    ))}
                </select>
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
