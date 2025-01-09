import React, { useEffect, useState } from "react";
import { getDepartments, getEmployees, getPositions, promoteToManager, removeEmployee } from "../services/api";
import { Employee } from "../types";
import { parseToken } from "../utils/parseToken";

interface EmployeeListProps {
    onEditEmployee: (id: number) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ onEditEmployee }) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
    const [positions, setPositions] = useState<{ id: number; name: string }[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getEmployees();
                setEmployees(data);
            } catch (error) {
                console.error("Ошибка при загрузке сотрудников:", error);
            }
        };

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
        fetchEmployees();
    }, []);

    const getDepartment = (departmentId: number) => {
        const findDepartment = departments.find(
            (department) => department.id === departmentId
        );

        if (findDepartment) {
            return findDepartment.name;
        }
    };

    const getPosition = (positionId: number) => {
        const findPosition = positions.find(
            (position) => position.id === positionId
        );

        if (findPosition) {
            return findPosition.name;
        }
    };

    const token = localStorage.getItem("token");
    let decodedToken = {
        id: 0,
        sub: "",
    };

    if (token) {
        decodedToken = parseToken(token);
    } else {
        console.log("Токен отсутствует.");
    }

    const handlePromoteToManager = async (employeeId: number) => {
        try {
            await promoteToManager(employeeId);
            alert("Сотрудник успешно повышен до менеджера!");
            const updatedEmployees = employees.map((employee) =>
                employee.id === employeeId ? { ...employee, role: "manager" } : employee
            );
            setEmployees(updatedEmployees);
        } catch (error) {
            console.error("Ошибка при повышении сотрудника:", error);
            setError("Не удалось повысить сотрудника.");
        }
    };

    const onDelete = async (id: number) => {
        try {
            await removeEmployee(id);
            alert("Сотрудник удален");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 w-full">
            <h2 className="text-2xl font-semibold mb-4">Список сотрудников</h2>
            {error && <p className="text-red-500">{error}</p>}
            {employees.length > 0 ? (
                <ul>
                    {employees.map((employee) => (
                        <li key={employee.id} className="mb-4">
                            <strong>
                                {employee.first_name} {employee.last_name}
                            </strong>{" "}
                            - {getPosition(employee.position_id)}
                            <br />
                            Отдел: {getDepartment(employee.department_id)}
                            <br />
                            Телефон: {employee.phone}
                            {(decodedToken.sub === "admin" ||
                                employee.id === decodedToken.id) && (
                                <button
                                    onClick={() => onEditEmployee(employee.id)}
                                    className="ml-4 text-blue-500"
                                >
                                    Редактировать
                                </button>
                            )}
                            {decodedToken.sub === "admin" && (
                                <button
                                    onClick={() => handlePromoteToManager(employee.id)}
                                    className="ml-4 text-green-500"
                                >
                                    Повысить до менеджера
                                </button>
                            )}
                            {(decodedToken.sub === "admin" ||
                                decodedToken.id === employee.id) && (
                                <button
                                    className="ml-4 text-red-500"
                                    onClick={() => 
                                        onDelete(employee.id)}
                                >
                                    Удалить
                                </button>
                            )}
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
