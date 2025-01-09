import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDepartments, getPositions, register } from "../services/api";

interface RegisterFormProps {
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        position: 0,
        department: 0,
        phone: "",
        password: "",
    });

    const [departments, setDepartments] = useState<
        { id: number; name: string }[]
    >([]);
    const [positions, setPositions] = useState<{ id: number; name: string }[]>(
        []
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const departmentsData = await getDepartments();
                const positionsData = await getPositions();

                setDepartments(departmentsData);
                setPositions(positionsData);
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
                setError("Ошибка загрузки данных");
            }
        };

        fetchData();
    }, []);

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = e.target.value.replace(/\D/g, "");
        setFormData((prevData) => ({
            ...prevData,
            phone: sanitizedValue,
        }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]:
                name === "department" || name === "position"
                    ? parseInt(value)
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.department) {
            setError("Пожалуйста, выберите отдел.");
            return;
        }
        if (!formData.position) {
            setError("Пожалуйста, выберите должность.");
            return;
        }

        try {
            const response = await register(formData);
            if (response.access_token) {
                localStorage.setItem("token", response.access_token);
                alert("Регистрация прошла успешно");
                setFormData({
                    first_name: "",
                    last_name: "",
                    position: 0,
                    department: 0,
                    phone: "",
                    password: "",
                });

                navigate("/");
            }
        } catch (error: any) {
            console.error("Ошибка при регистрации:", error);
            setError(error.response?.data?.detail || "Произошла ошибка");
        }
    };

    const fieldLabels: Record<
        keyof Omit<typeof formData, "department" | "position">,
        { name: string; type: string }
    > = {
        first_name: { name: "Имя", type: "text" },
        last_name: { name: "Фамилия", type: "text" },
        phone: { name: "Телефон", type: "text" },
        password: { name: "Пароль", type: "password" },
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Регистрация
                </h2>

                {Object.keys(fieldLabels).map((field) => (
                    <div key={field} className="mb-4">
                        <label htmlFor={field} className="block text-gray-700">
                            {
                                fieldLabels[field as keyof typeof fieldLabels]
                                    .name
                            }
                        </label>
                        <input
                            type={
                                fieldLabels[field as keyof typeof fieldLabels]
                                    .type
                            }
                            id={field}
                            name={field}
                            value={formData[field as keyof typeof formData]}
                            onChange={
                                field === "phone"
                                    ? handlePhoneInput
                                    : handleChange
                            }
                            className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>
                ))}

                <div className="mb-4">
                    <label htmlFor="department" className="block text-gray-700">
                        Отдел
                    </label>
                    <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    >
                        <option value={0}>Выберите отдел</option>
                        {departments.map((department) => (
                            <option key={department.id} value={department.id}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="position" className="block text-gray-700">
                        Должность
                    </label>
                    <select
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    >
                        <option value={0}>Выберите должность</option>
                        {positions.map((position) => (
                            <option key={position.id} value={position.id}>
                                {position.name}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                    Зарегистрировать
                </button>

                <div className="mt-4 text-center">
                    <p className="text-sm">
                        Уже есть аккаунт?{" "}
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="text-blue-500 hover:underline"
                        >
                            Авторизоваться
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
