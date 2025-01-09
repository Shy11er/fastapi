import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    demoteManagerToEmployee,
    getDepartments,
    getManagers,
    getPositions,
    removeEmployee,
} from "../services/api";
import { Employee } from "../types";
import { parseToken } from "../utils/parseToken";

interface ManagerListProps {
    onEditManager: (id: number) => void;
}

const ManagerList: React.FC<ManagerListProps> = ({ onEditManager }) => {
    const [managers, setManagers] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<
        { id: number; name: string }[]
    >([]);
    const [positions, setPositions] = useState<{ id: number; name: string }[]>(
        []
    );

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const filtredManagers = await getManagers();
                setManagers(filtredManagers);
            } catch (error) {
                console.error("Ошибка при загрузке менеджеров:", error);
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

        fetchManagers();
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

    const handleDemoteToEmployee = async (id: number) => {
        try {
            await demoteManagerToEmployee(id);
            setManagers((prev) => prev.filter((manager) => manager.id !== id));
            toast.success("Менеджер успешно понижен до сотрудника");
        } catch (error) {
            console.error("Ошибка при понижении менеджера:", error);
            toast.error("Не удалось понизить менеджера");
        }
    };

    const onDeleteManager = async (id: number) => {
        try {
            await removeEmployee(id);
            setManagers((prev) => prev.filter((manager) => manager.id !== id));
            toast.success("Менеджер удален");
        } catch (error) {
            console.error(error);
            toast.error("Не удалось удалить менеджера");
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 w-full">
            <h2 className="text-2xl font-semibold mb-4">Список менеджеров</h2>
            {managers.length > 0 ? (
                <ul>
                    {managers.map((manager) => (
                        <li key={manager.id} className="mb-2">
                            <strong>
                                {manager.first_name} {manager.last_name}
                            </strong>{" "}
                            - {getPosition(manager.position_id)}
                            <br />
                            Отдел: {getDepartment(manager.department_id)}
                            <br />
                            Телефон: {manager.phone}
                            {(decodedToken.sub === "admin" ||
                                decodedToken.id === manager.id) && (
                                <button
                                    onClick={() => onEditManager(manager.id)}
                                    className="ml-4 text-blue-500"
                                >
                                    Редактировать
                                </button>
                            )}
                            {decodedToken.sub === "admin" && (
                                <button
                                    onClick={() =>
                                        handleDemoteToEmployee(manager.id)
                                    }
                                    className="ml-4 text-yellow-500"
                                >
                                    Понизить до сотрудника
                                </button>
                            )}
                            {(decodedToken.sub === "admin" ||
                                decodedToken.id === manager.id) && (
                                <button
                                    className="ml-4 text-red-500"
                                    onClick={() => onDeleteManager(manager.id)}
                                >
                                    Удалить
                                </button>
                            )}
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
