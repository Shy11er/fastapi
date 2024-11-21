export interface Document {
  id: number;
  type: string;
  description: string;
  deadline: string;
  status: string;
  executor_id: number;
  manager_id: number;
}

export interface DocumentCreate {
  type: string;
  description: string;
  deadline: string;
  status: string;
  executor_id: number;
  manager_id: number;
}
