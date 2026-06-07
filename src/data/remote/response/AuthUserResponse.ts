import { AuthUser } from "../../../domain/models/auth/AuthUser"

export interface AuthUserResponse {
    id: string,
    created_at: string,
    name: string,
    last_name: string,
    email: string,
    role: RoleResponse
}

type RoleResponse = 
  | "user"
  | "admin"
  | "employee"

export const authUserToDomain = (
    response: AuthUserResponse
): AuthUser => {
    return {
        id: response.id,
        createdAt: response.created_at,
        name: response.name,
        lastName: response.last_name,
        email: response.email,
        role: response.role
    }
}