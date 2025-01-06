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
  executor_id: number;
  manager_id: number;
  status?: string;
}


export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  phone: string;
}

export interface EmployeeCreate {
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  phone: string;
}

export interface Manager {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  phone: string;
}

export interface ManagerCreate {
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  phone: string;
}

