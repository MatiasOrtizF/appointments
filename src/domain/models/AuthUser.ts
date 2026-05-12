import { Role } from "./Service"

export interface AuthUser {
    uid: string
    email: string,
    fullName: string,
    role: Role
}