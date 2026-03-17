import { doc, setDoc, deleteDoc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../config/Firebase"
import { User } from "../../domain/models/User"
import { UserSignUp } from "../../domain/models/UserSignUp"

const COLLECTION_USERS = "users"

export class UserRepository {

    async createUser(userSignUp: UserSignUp, uid: string): Promise<boolean> {

        const user = {
            email: userSignUp.email,
            name: userSignUp.name,
            lastName: userSignUp.lastName
        }

        try {

            await setDoc(
                doc(db, COLLECTION_USERS, uid),
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
                doc(db, COLLECTION_USERS, uid)
            )

            return true

        } catch (error) {
            throw error
        }
    }

    async getUser(uid: string): Promise<User | null> {

        try {

            const userDoc = await getDoc(
                doc(db, COLLECTION_USERS, uid)
            )

            if (userDoc.exists()) {
                const data = userDoc.data()
                return data as User
            }

            return null

        } catch {
            return null
        }
    }

    async editUser(
        uid: string,
        newName: string,
        newLastName: string
    ): Promise<boolean | null> {

        try {

            await updateDoc(
                doc(db, COLLECTION_USERS, uid),
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