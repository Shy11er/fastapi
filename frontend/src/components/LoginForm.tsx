import React, { useState } from "react";

interface LoginFormProps {
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
    });

    const handleLogin = async (e: React.FormEvent) => {
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Авторизация
                </h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">
                            Телефон
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-gray-700"
                        >
                            Пароль
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                        Авторизоваться
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Нет аккаунта?{" "}
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={onSwitchToRegister}
                    >
                        Зарегистрируйтесь
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
