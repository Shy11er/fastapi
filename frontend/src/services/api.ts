import axios from "axios";
import {
    Document,
    DocumentCreate,
    Employee,
    EmployeeCreate,
    Manager,
    ManagerCreate,
} from "../types";

const API_URL = "http://127.0.0.1:8000";

export const getDocuments = async (status: string): Promise<Document[]> => {
    const response = await axios.get(
        `${API_URL}/documents/status/${encodeURIComponent(status)}`
    );
    return response.data;
};

export const updateDocumentDeadline = async (
    documentId: number,
    newDeadline: string
): Promise<Document> => {
    const response = await axios.put(
        `${API_URL}/documents/${documentId}/deadline/`,
        {
            deadline: newDeadline,
        }
    );
    return response.data;
};

export const addDocument = async (
    document: DocumentCreate
): Promise<Document> => {
    const response = await axios.post(`${API_URL}/documents/`, document);
    return response.data;
};

export const markDocumentComplete = async (id: number): Promise<Document> => {
    const response = await axios.patch(`${API_URL}/documents/${id}/complete`);
    return response.data.document;
};

export const getEmployees = async (): Promise<Employee[]> => {
    const response = await axios.get(`${API_URL}/employees/`);
    return response.data;
};

export const getEmployee = async (employeeId: number): Promise<Employee> => {
    const response = await axios.get(`${API_URL}/employees/${employeeId}`);
    return response.data;
};

export const getManager = async (managerId: number): Promise<Manager> => {
    const response = await axios.get(`${API_URL}/managers/${managerId}`);
    return response.data;
};

export const addEmployee = async (
    employee: EmployeeCreate
): Promise<Employee> => {
    const response = await axios.post(`${API_URL}/employees/`, employee);
    return response.data;
};

export const getManagers = async (): Promise<Manager[]> => {
    const response = await axios.get(`${API_URL}/managers/`);
    return response.data;
};

export const addManager = async (manager: ManagerCreate): Promise<Manager> => {
    const response = await axios.post(`${API_URL}/managers/`, manager);
    return response.data;
};

export const updateEmployee = async (id: number, data: Employee) => {
    const response = await axios.put(`${API_URL}/employees/${id}`, data);

    return await response.data;
};

export const removeEmployee = async (id: number) => {
    const response = await axios.delete(`${API_URL}/employees/${id}`);
    return response.data;
};

export const getDepartments = async () => {
    const response = await axios.get(`${API_URL}/departments`);
    return response.data;
};

export const getPositions = async () => {
    const response = await axios.get(`${API_URL}/positions`);
    return response.data;
};

export const register = async (data: any) => {
    const response = await axios.post(`${API_URL}/register/`, data);
    return response.data;
};

export const login = async (data: any) => {
    const response = await axios.post(`${API_URL}/login/`, data);
    return response.data;
};

export const promoteToManager = async (employeeId: number) => {
    const response = await axios.post(
        `${API_URL}/employees/${employeeId}/promote`
    );
    return response.data;
};

export const demoteManagerToEmployee = async (id: number) => {
    const response = await axios.post(`${API_URL}/managers/${id}/demote`);

    return response.data;
};
