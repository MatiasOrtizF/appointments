import { Role } from "../service/Service";

export interface CreateUserRequest {
    uid: string,
    name: string,
    lastName: string,
    email: string,
    password: string,
    role: Role
}