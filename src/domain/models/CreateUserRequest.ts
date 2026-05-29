import { EmployeeStatus, Role } from "./Service";

export interface CreateUserRequest {
    name: string,
    lastName: string,
    email: string,
    password: string,
}