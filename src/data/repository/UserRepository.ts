import { doc, setDoc, deleteDoc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../config/Firebase"
import { AuthUser } from "../../domain/models/AuthUser"
import { UserSignUp } from "../../domain/models/UserSignUp"
import { AuthUserResponse } from "../remote/response/AuthUserResponse"
import { toDomain } from "../remote/response/AuthUserResponse"
import { Result } from "../../shared/types/result"
import { UserError } from "../../errors/userError"
import { FirebaseError } from "firebase/app"

const COLLECTION_USER = "user"

export class UserRepository {

    async createUser(userSignUp: UserSignUp, uid: string): Promise<boolean> {

        const user = {
            email: userSignUp.email,
            name: userSignUp.name,
            lastName: userSignUp.lastName
        }

        try {

            await setDoc(
                doc(db, COLLECTION_USER, uid),
                user
            )

            return true

        } catch (error) {
            throw error
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

            console.log("document: "+userDoc.data())

            if (!userDoc.exists()) {
                return { ok: false, error: "not-found" };
            }

            const data = userDoc.data() as AuthUserResponse;

            return {
                ok: true,
                data: toDomain(userDoc.id, data),
            };

        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case "permission-denied":
                        return { ok: false, error: "permission" };

                    case "unavailable":
                        return { ok: false, error: "network" };

                    default:
                        return { ok: false, error: "unknown" };
                }
            }

            return { ok: false, error: "unknown" };
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

export const userRepository = new UserRepository();