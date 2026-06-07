import { Role } from "../service/Service"

export interface AuthUser {
    id: string,
    createdAt: string,
    name: string,
    lastName: string,
    email: string,
    role: Role
}