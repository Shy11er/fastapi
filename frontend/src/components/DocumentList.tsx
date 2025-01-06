import React, { useState, useEffect } from "react";
import { getDocuments, updateDocumentDeadline } from "../services/api";
import { Document } from "../types";

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("В работе");
  const [editingDocumentId, setEditingDocumentId] = useState<number | null>(null);
  const [newDeadline, setNewDeadline] = useState<string>("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getDocuments(statusFilter);
        setDocuments(data);
      } catch (error) {
        console.error("Ошибка при загрузке документов:", error);
      }
    };

    fetchDocuments();
  }, [statusFilter]);

  const handleEditDeadline = (documentId: number) => {
    setEditingDocumentId(documentId);
  };

  const handleSaveDeadline = async (documentId: number) => {
    try {
      console.log("Отправляемые данные:", { documentId, newDeadline }); // Лог данных
      const updatedDocument = await updateDocumentDeadline(documentId, newDeadline);
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === documentId ? updatedDocument : doc))
      );
      setEditingDocumentId(null);
      setNewDeadline("");
    } catch (error) {
      console.error("Ошибка при обновлении дедлайна:", error);
    }
  };
  

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Список документов</h2>

      {/* Фильтрация по статусу */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setStatusFilter("В работе")}
          className={`px-6 py-2 rounded-full ${
            statusFilter === "В работе" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          В работе
        </button>
        <button
          onClick={() => setStatusFilter("Просрочено")}
          className={`px-6 py-2 rounded-full ${
            statusFilter === "Просрочено" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Просрочено
        </button>
        <button
          onClick={() => setStatusFilter("Завершено")}
          className={`px-6 py-2 rounded-full ${
            statusFilter === "Завершено" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Завершено
        </button>
      </div>

      {/* Список документов */}
      <ul>
        {documents.length === 0 ? (
          <p>Нет документов для отображения.</p>
        ) : (
          documents.map((doc) => (
            <li key={doc.id} className="border-b py-2">
              <p>Тип: {doc.type}</p>
              <p>Описание: {doc.description}</p>
              <p>Срок исполнения: {doc.deadline}</p>
              <p>Статус: {doc.status}</p>
              {editingDocumentId === doc.id ? (
                <div>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="border rounded px-3 py-2 mt-1"
                  />
                  <button
                    onClick={() => handleSaveDeadline(doc.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded ml-2"
                  >
                    Сохранить
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEditDeadline(doc.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Изменить дедлайн
                </button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DocumentList;
