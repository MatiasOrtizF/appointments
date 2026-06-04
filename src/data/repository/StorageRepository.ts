import { supabase } from "../../config/Supabase"
import { StorageError } from "../../errors/storage/storageError"
import { Result } from "../../shared/types/result"

export class StorageRepository {
    async uploadImage(imageUri: string, folder: string): Promise<Result<string, StorageError>> {
        try {
            const response = await fetch(imageUri)
            const arrayBuffer = await response.arrayBuffer()
            const fileName = `${Date.now()}-${Math.random()}.jpg`
            const path = `${folder}/${fileName}`

            const { data, error } = await supabase.storage
                .from("images")
                .upload(
                    path,
                    arrayBuffer,
                    {
                        contentType: "image/jpeg",
                        upsert: false,
                    }
                )

            if (error) {
                throw error
            }

            const { data: publicUrlData } = supabase.storage
                .from("images")
                .getPublicUrl(path)

            return {
                ok: true,
                data: publicUrlData.publicUrl,
            }

        } catch (error) {
            return handleStorageError(error)
        }
    }
}

const handleStorageError = (
    error: any
): Result<never, StorageError> => {

    console.log("SERVICE ERROR:", error)

    switch (error?.code) {

        // RLS / permisos
        case "42501":
            return { ok: false, error: "permission" }

        // no encontrado
        case "PGRST116":
            return { ok: false, error: "not-found" }

        // timeout/network
        case "57014":
            return { ok: false, error: "timeout" }

        // postgres connection
        case "08006":
        case "08001":
            return { ok: false, error: "network" }

        default:
            return { ok: false, error: "unknown" }
    }

    return { ok: false, error: "unknown" };
};

export const storageRepository = new StorageRepository();