import { Result } from "../shared/types/result";

export type DatabaseError =
    | "permission"
    | "network"
    | "validation"
    | "conflict"
    | "not-found"
    | "timeout"
    | "unauthenticated"
    | "unknown"

export const handleDatabaseError = (
    error: any
): Result<never, DatabaseError> => {

    if (
        error?.message?.includes("Network request failed") ||
        error?.message?.includes("Failed to fetch")
    ) {
        return { ok: false, error: "network" }
    }

    // Usuario no autenticado
    if (
        error?.status === 401 ||
        error?.message?.includes("JWT") ||
        error?.message?.includes("Auth session missing") ||
        error?.message?.includes("Invalid JWT")
    ) {
        return { ok: false, error: "unauthenticated" };
    }

    if (error?.status === 403) {
        return { ok: false, error: "permission" };
    }

    switch (error?.code) {

        // NOT NULL violation
        case "23502":
            return {
                ok: false,
                error: "validation"
            };

        // Foreign Key violation
        case "23503":
            return {
                ok: false,
                error: "validation"
            };

        // Unique violation
        case "23505":
            return {
                ok: false,
                error: "conflict"
            };

        // RLS / permisos
        case "42501":
            return {
                ok: false,
                error: "permission"
            };

        // No rows found
        case "PGRST116":
            return {
                ok: false,
                error: "not-found"
            };

        // Query timeout
        case "57014":
            return {
                ok: false,
                error: "timeout"
            };

        // PostgreSQL connection errors
        case "08001":
        case "08006":
            return {
                ok: false,
                error: "network"
            };

        default:
            return {
                ok: false,
                error: "unknown"
            };
    }
};