import React, { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login(formData);
            localStorage.setItem("token", response.access_token);
            alert("Авторизация прошла успешно");
            setFormData({
                phone: "",
                password: "",
            });
            navigate("/");
        } catch (error) {
            console.error("Ошибка при авторизации:", error);
            alert("Произошла ошибка");
        }
    };

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = e.target.value.replace(/\D/g, "");
        setFormData({
            ...formData,
            phone: sanitizedValue,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowedKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
        ];
        if (
            !/^[0-9]$/.test(e.key) &&
            !allowedKeys.includes(e.key)
        ) {
            e.preventDefault();
            alert("Введите только числа");
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
                        <label htmlFor="phone" className="block text-gray-700">
                            Телефон
                        </label>
                        <input
                            type="text"
                            id="phone"
                            className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            value={formData.phone}
                            onChange={handlePhoneInput}
                            onKeyDown={handleKeyDown}
                            inputMode="numeric"
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
