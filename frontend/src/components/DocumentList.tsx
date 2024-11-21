import React from "react";
import { markDocumentComplete } from "../services/api";
import { Document } from "../types";

interface Props {
    documents: Document[];
    onDocumentUpdated: (updatedDocument: Document) => void;
}

const DocumentList: React.FC<Props> = ({ documents, onDocumentUpdated }) => {
    const handleComplete = async (id: number) => {
        try {
            // Вызываем API для завершения документа
            const updatedDocument = await markDocumentComplete(id);

            // Обновляем документ в состоянии
            onDocumentUpdated(updatedDocument);
        } catch (error) {
            console.error("Ошибка при завершении документа:", error);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Список документов</h2>
            {documents.length > 0 ? (
                <ul>
                    {documents.map((doc) => (
                        <li key={doc.id} className="mb-2">
                            <strong>Тип:</strong> {doc.type} <br />
                            <strong>Описание:</strong> {doc.description} <br />
                            <strong>Срок исполнения:</strong>{" "}
                            {new Date(doc.deadline).toLocaleDateString()} <br />
                            <strong>Статус:</strong> {doc.status} <br />
                            {/* Отображаем кнопку только для статуса "В работе" */}
                            {doc.status === "В работе" && (
                                <button
                                    onClick={() => handleComplete(doc.id)}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mt-2"
                                >
                                    Завершить
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет документов для отображения.</p>
            )}
        </div>
    );
};

export default DocumentList;
