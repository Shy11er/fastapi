import axios from "axios";
import { Document, DocumentCreate } from "../types";

const API_URL = "http://127.0.0.1:8000";

export const getDocuments = async (status: string): Promise<Document[]> => {
  const response = await axios.get(`${API_URL}/documents/status/${status}`);
  return response.data;
};

export const addDocument = async (document: DocumentCreate): Promise<Document> => {
  const response = await axios.post(`${API_URL}/documents/`, document);
  return response.data;
};

export const markDocumentComplete = async (id: number): Promise<Document> => {
  const response = await axios.patch(`${API_URL}/documents/${id}/complete`);
  return response.data.document;
};
