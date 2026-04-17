import { AuthUser } from "../../../domain/models/AuthUser"

export interface AuthUserResponse {
    fullName: string
    email: string
    role: "admin" | "client"
}

export const toDomain = (
    uid: string,
    response: AuthUserResponse
): AuthUser => {
    return {
        uid,
        fullName: response.fullName,
        email: response.email,
        role: response.role
    }
}