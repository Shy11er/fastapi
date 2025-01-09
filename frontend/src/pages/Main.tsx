import { useEffect, useState } from "react";
import DocumentForm from "../components/DocumentForm";
import DocumentList from "../components/DocumentList";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import ManagerForm from "../components/ManagerForm";
import ManagerList from "../components/ManagerList";
import { getDocuments } from "../services/api";
import { Document } from "../types";

const Main = () => {
    const [activeTab, setActiveTab] = useState<string>("documents");
    const [documents, setDocuments] = useState<Document[]>([]);
    const [status, setStatus] = useState<string>("В работе");
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
        null
    );
    const [selectedManagerId, setSelectedManagerId] = useState<number | null>(
        null
    );

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

    const handleDocumentUpdated = (updatedDocument: Document) => {
        setDocuments((prevDocuments) =>
            prevDocuments.map((doc) =>
                doc.id === updatedDocument.id ? updatedDocument : doc
            )
        );
    };

    const handleEmployeeUpdated = (updatedEmployee: any) => {
        setSelectedEmployeeId(null);
    };

    const handleManagerUpdated = (updatedManager: any) => {
        setSelectedManagerId(null);
    };

    const onLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/auth";
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <header className="bg-blue-600 text-white py-4 shadow-lg flex flex-row justify-between">
                <h1 className="text-3xl font-bold text-center">
                    Автоматизация канцелярии
                </h1>
                <button
                    className="p-4 bg-red-500 text-white"
                    onClick={onLogout}
                >
                    Выйти
                </button>
            </header>
            <main className="max-w-7xl mx-auto py-8 px-4">
                {/* Переключатели */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab("documents")}
                        className={`px-6 py-2 rounded-full font-semibold ${
                            activeTab === "documents"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        } hover:bg-blue-600`}
                    >
                        Документы
                    </button>
                    <button
                        onClick={() => setActiveTab("employees")}
                        className={`px-6 py-2 rounded-full font-semibold ${
                            activeTab === "employees"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        } hover:bg-blue-600`}
                    >
                        Сотрудники
                    </button>
                    <button
                        onClick={() => setActiveTab("managers")}
                        className={`px-6 py-2 rounded-full font-semibold ${
                            activeTab === "managers"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        } hover:bg-blue-600`}
                    >
                        Менеджеры
                    </button>
                </div>

                {/* Контент */}
                {activeTab === "documents" && (
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
                )}
                {activeTab === "employees" && (
                    <div className="flex gap-4">
                        <EmployeeList
                            onEditEmployee={(id) => setSelectedEmployeeId(id)}
                        />
                        {selectedEmployeeId && (
                            <EmployeeForm
                                employeeId={selectedEmployeeId}
                                onEmployeeUpdated={handleEmployeeUpdated}
                            />
                        )}
                    </div>
                )}
                {activeTab === "managers" && (
                    <div className="flex gap-4">
                        <ManagerList
                            onEditManager={(id) => setSelectedManagerId(id)}
                        />
                        {selectedManagerId && (
                            <ManagerForm
                                managerId={selectedManagerId}
                                onManagerUpdated={handleManagerUpdated}
                            />
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Main;
