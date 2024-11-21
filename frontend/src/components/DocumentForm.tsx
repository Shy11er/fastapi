import React, { useState } from "react";
import { DocumentCreate } from "../types";
import { addDocument } from "../services/api";

interface DocumentFormProps {
    onDocumentAdded: (document: any) => void; // Функция для обновления списка документов
}

const DocumentForm: React.FC<DocumentFormProps> = ({ onDocumentAdded }) => {
    const [formData, setFormData] = useState<DocumentCreate>({
        type: "",
        description: "",
        deadline: "",
        executor_id: 0,
        manager_id: 0,
        status: "В работе",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newDocument = await addDocument(formData); // Используем API для добавления документа
            onDocumentAdded(newDocument); // Обновляем список документов
            setFormData({
                type: "",
                description: "",
                deadline: "",
                executor_id: 0,
                manager_id: 0,
                status: "В работе",
            });
        } catch (error) {
            console.error("Ошибка при добавлении документа:", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-lg p-6"
        >
            <h2 className="text-2xl font-semibold mb-4">Добавить документ</h2>
            <div className="mb-4">
                <label className="block text-gray-700">Тип документа:</label>
                <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Описание:</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Срок исполнения:</label>
                <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">ID исполнителя:</label>
                <input
                    type="number"
                    name="executor_id"
                    value={formData.executor_id}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">ID руководителя:</label>
                <input
                    type="number"
                    name="manager_id"
                    value={formData.manager_id}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Добавить
            </button>
        </form>
    );
};

export default DocumentForm;
