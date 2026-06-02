import { Role } from "./Service"

export interface AuthUser {
    id: string,
    createdAt: string,
    name: string,
    lastName: string,
    email: string,
    role: Role
}