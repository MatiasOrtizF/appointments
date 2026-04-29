import { doc, setDoc, deleteDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore"
import { db } from "../../config/Firebase"
import { AuthUser } from "../../domain/models/AuthUser"
import { AuthUserResponse } from "../remote/response/AuthUserResponse"
import { toDomain } from "../remote/response/AuthUserResponse"
import { Result } from "../../shared/types/result"
import { UserError } from "../../errors/userError"
import { FirebaseError } from "firebase/app"
import { CreateUserRequest } from "../../domain/models/CreateUserRequest"

const COLLECTION_USER = "user"

export class UserRepository {

    async createUser(request: CreateUserRequest): Promise<Result<void, UserError>> {
        try {
            const userId = request.uid

            const userRef = doc(
                db,
                COLLECTION_USER,
                userId
            );

            await setDoc(userRef, {
                ...request,
                id: userId,
                createdAt: Timestamp.now(),
            });

            return { ok: true, data: undefined }

        } catch (error) {
            return handleUserError(error)
        }
    }

    async deleteUser(uid: string): Promise<boolean> {

        try {

            await deleteDoc(
                doc(db, COLLECTION_USER, uid)
            )

            return true

        } catch (error) {
            throw error
        }
    }

    async getUser(uid: string): Promise<Result<AuthUser, UserError>> {
        try {

            const userDoc = await getDoc(
                doc(db, COLLECTION_USER, uid)
            )

            console.log("document: " + userDoc.data())

            if (!userDoc.exists()) {
                return { ok: false, error: "not-found" };
            }

            const data = userDoc.data() as AuthUserResponse;

            return {
                ok: true,
                data: toDomain(userDoc.id, data),
            };

        } catch (error) {
            return handleUserError(error)
        }
    }

    async editUser(
        uid: string,
        newName: string,
        newLastName: string
    ): Promise<boolean | null> {

        try {

            await updateDoc(
                doc(db, COLLECTION_USER, uid),
                {
                    name: newName,
                    lastName: newLastName
                }
            )

            return true

        } catch {
            return null
        }
    }

}

const handleUserError = (
    error: unknown
): Result<never, UserError> => {

    if (error instanceof FirebaseError) {
        switch (error.code) {
            // auth
            case "auth/email-already-in-use":
                return { ok: false, error: "email-already-in-use" };

            case "auth/weak-password":
                return { ok: false, error: "weak-password" };

            case "auth/invalid-email":
                return { ok: false, error: "invalid-email" };

            case "auth/user-not-found":
                return { ok: false, error: "not-found" };

            case "auth/wrong-password":
            case "auth/invalid-credential":
            case "auth/unauthenticated":
                return { ok: false, error: "unauthenticated" };

            // firestore / infra
            case "permission-denied":
                return { ok: false, error: "permission" };

            case "unavailable":
                return { ok: false, error: "network" };

            case "deadline-exceeded":
                return { ok: false, error: "timeout" };

            case "not-found":
                return { ok: false, error: "not-found" };

            default:
                return { ok: false, error: "unknown" };
        }
    }

    return { ok: false, error: "unknown" };
};

export const userRepository = new UserRepository();