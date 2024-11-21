import React, { useEffect, useState } from "react";
import DocumentForm from "./components/DocumentForm";
import DocumentList from "./components/DocumentList";
import { getDocuments } from "./services/api";
import { Document } from "./types";

const App: React.FC = () => {
    const [status, setStatus] = useState<string>("В работе");
    const [documents, setDocuments] = useState<Document[]>([]);

    // Получение документов по статусу
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const data = await getDocuments(status);
                setDocuments(data);
            } catch (error) {
                console.error("Ошибка при загрузке документов:", error);
            }
        };

        fetchDocuments();
    }, [status]);

    // Обновление документа в списке
    const handleDocumentUpdated = (updatedDocument: Document) => {
        setDocuments((prevDocuments) =>
            prevDocuments.map((doc) =>
                doc.id === updatedDocument.id ? updatedDocument : doc
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <header className="bg-blue-600 text-white py-4 shadow-lg">
                <h1 className="text-3xl font-bold text-center">
                    Автоматизация канцелярии
                </h1>
            </header>
            <main className="max-w-7xl mx-auto py-8 px-4">
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setStatus("В работе")}
                        className={`px-6 py-2 rounded-full font-semibold ${
                            status === "В работе"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        } hover:bg-blue-600`}
                    >
                        В работе
                    </button>
                    <button
                        onClick={() => setStatus("Просрочено")}
                        className={`px-6 py-2 rounded-full font-semibold ${
                            status === "Просрочено"
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        } hover:bg-red-600`}
                    >
                        Просрочено
                    </button>
                    <button
                        onClick={() => setStatus("Завершено")}
                        className={`px-6 py-2 rounded-full font-semibold ${
                            status === "Завершено"
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        } hover:bg-green-600`}
                    >
                        Завершено
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DocumentList
                        documents={documents}
                        onDocumentUpdated={handleDocumentUpdated}
                    />
                    <DocumentForm
                        onDocumentAdded={(newDocument) =>
                            setDocuments((prev) => [...prev, newDocument])
                        }
                    />
                </div>
            </main>
        </div>
    );
};

export default App;
