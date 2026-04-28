import { User } from "firebase/auth"
import { Result } from "../../shared/types/result"
import { UserError } from "../userError"

export type RegisterError =
    | "email-already-in-use"
    | "weak-password"
    | "invalid-email"
    | "too-many-requests"
    | "network"
    | "timeout"
    | "unknown"

export type RegisterResult = Result<User, RegisterError>

export const mapRegisterErrorToMessage = (error: RegisterError): UserError => {
    switch (error) {

        case "email-already-in-use":
            return "email-already-in-use";

        case "weak-password":
            return "weak-password";

        case "invalid-email":
            return "invalid-email";

        case "network":
            return "network";

        case "timeout":
            return "timeout";

        case "too-many-requests":
            return "unknown"; // o agregarlo a UserError

        default:
            return "unknown";
    }
}