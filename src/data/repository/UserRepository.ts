import { doc, setDoc, deleteDoc, getDoc, updateDoc, Timestamp, collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../config/Firebase"
import { AuthUser } from "../../domain/models/auth/AuthUser"
import { AuthUserResponse } from "../remote/response/AuthUserResponse"
import { toDomain } from "../remote/response/AuthUserResponse"
import { Result } from "../../shared/types/result"
import { UserError } from "../../errors/userError"
import { FirebaseError } from "firebase/app"
import { CreateUserRequest } from "../../domain/models/auth/CreateUserRequest"
import { withTimeout } from "../../utils/withTimeOut"
import { EmployeeResponse, employeeToDomain } from "../remote/response/EmployeeResponse"
import { Employee, Role, roles } from "../../domain/models/service/Service"
import { EditEmployeeRequest } from "../../domain/models/employee/EditEmployeeRequest"
import { supabase } from "../../config/Supabase"

const COLLECTION_USERS = "usuarios"

export class UserRepository {

    async createUser(request: CreateUserRequest): Promise<Result<void, UserError>> {
        try {
            const { data, error } = await supabase
                .from(COLLECTION_USERS)
                .insert({
                    id: request.uid,
                    name: request.name,
                    last_name: request.lastName,
                    email: request.email,
                })
                .select()
                .single()


            if (error) throw error
            console.log("error al crear usuario2", error)

            return { ok: true, data: undefined }

        } catch (error) {
            console.log("error al crear usuario1", error)
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

    async getEmployees(): Promise<Result<Employee[], UserError>> {
        try {

            const q = query(
                collection(db, COLLECTION_USER),
                where("role", "in", ["employee", "admin"])
            )


            const snapshot = await withTimeout(
                getDocs(q),
                10000
            )

            const employees = snapshot.docs.map((docSnap) => {
                const data = docSnap.data() as EmployeeResponse

                return employeeToDomain(docSnap.id, data)
            })

            return { ok: true, data: employees }

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

    async editRoleUser(email: string, role: Role): Promise<Result<void, UserError>> {
        try {

            const q = query(
                collection(db, COLLECTION_USER),
                where("email", "==", email)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return {
                    ok: false,
                    error: "not-found"
                };
            }

            const userDoc = querySnapshot.docs[0];

            await updateDoc(userDoc.ref, {
                role,
            });

            return { ok: true, data: undefined }

        } catch (error) {
            return handleUserError(error)
        }
    }

    async editEmployee(employee: EditEmployeeRequest): Promise<Result<void, UserError>> {
        try {
            const userRef = doc(db, COLLECTION_USER, employee.id)

            const employeeResponse: EmployeeResponse = {
                name: employee.name,
                lastName: employee.lastName,
                img: employee.img,
                role: employee.role,
                status: employee.status
            }

            await withTimeout(
                updateDoc(userRef, {
                    ...employeeResponse
                }),
                10000
            )

            return {
                ok: true,
                data: undefined
            }

        } catch (error) {
            console.log(error)
            return handleUserError(error)
        }
    }

    async deleteEmployee(id: string): Promise<Result<void, UserError>> {
        try {
            const userRef = doc(db, COLLECTION_USER, id)

            await withTimeout(
                updateDoc(userRef, {
                    role: roles.USER,
                }),
                10000
            )

            return {
                ok: true,
                data: undefined
            }

        } catch (error) {
            console.log(error)
            return handleUserError(error)
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