import React, { useState, useEffect } from "react";

interface RegisterFormProps {
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        position: "",
        department: "",
        phone: "",
        password: "",
    });

    const [departments, setDepartments] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const departmentsResponse = await fetch("http://localhost:8000/departments/");
                const positionsResponse = await fetch("http://localhost:8000/positions/");

                const departmentsData = await departmentsResponse.json();
                const positionsData = await positionsResponse.json();

                setDepartments(departmentsData);
                setPositions(positionsData);
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/employees/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert("Регистрация прошла успешно");
                setFormData({
                    first_name: "",
                    last_name: "",
                    position: "",
                    department: "",
                    phone: "",
                    password: "",
                });
            } else {
                alert("Ошибка регистрации");
            }
        } catch (error) {
            console.error("Ошибка при регистрации:", error);
            alert("Произошла ошибка");
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
                            {fieldLabels[field as keyof typeof fieldLabels].name}
                        </label>
                        <input
                            type={fieldLabels[field as keyof typeof fieldLabels].type}
                            id={field}
                            name={field}
                            value={formData[field as keyof typeof formData]}
                            onChange={handleChange}
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
                        <option value="">Выберите отдел</option>
                        {departments.map((department) => (
                            <option key={department} value={department}>
                                {department}
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
                        <option value="">Выберите должность</option>
                        {positions.map((position) => (
                            <option key={position} value={position}>
                                {position}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                    Зарегистрировать
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
