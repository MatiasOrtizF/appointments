import { Result } from "../../shared/types/result"
import { LoginError } from "../../errors/auth/loginErrors"
import { RegisterError } from "../../errors/auth/registerError"
import { VerificationEmailError } from "../../errors/auth/verificationEmailError"
import { VerifyEmailError } from "../../errors/auth/verifyEmailError"
import { PasswordRecoveryError } from "../../errors/auth/passwordRecoveryError"
import { UpdatePasswordError } from "../../errors/auth/updatePasswordError"
import { SignOutError } from "../../errors/auth/signOutError"
import { supabase } from "../../config/Supabase"
import { User } from "@supabase/supabase-js"
import { CreateUserRequest } from "../../domain/models/CreateUserRequest"

export class AuthRepository {
  async login(
    email: string,
    password: string
  ): Promise<Result<User, LoginError>> {

    try {

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password
        })

      if (error) {
        return handleAuthError(error)
      }

      if (!data.user) {
        return {
          ok: false,
          error: "unknown"
        }
      }

      return {
        ok: true,
        data: data.user
      }

    } catch (error) {

      return handleAuthError(error)
    }
  }

  async signUp(request: CreateUserRequest): Promise<Result<User, RegisterError>> {

    try {
      const { data, error } =
        await supabase.auth.signUp({
          email: request.email,
          password: request.password,
          options: {
            data: {
              name: request.name,
              lastName: request.lastName
            }
          }
        })

      if (error) {
        return handleAuthError(error)
      }

      if (!data.user) {
        return {
          ok: false,
          error: "unknown"
        }
      }

      return {
        ok: true,
        data: data.user
      }

    } catch (error) {
      return handleAuthError(error)
    }
  }

  async sendVerificationEmail():
    Promise<Result<void, VerificationEmailError>> {

    try {

      return {
        ok: true,
        data: undefined
      }

    } catch {

      return {
        ok: false,
        error: "unknown"
      }
    }
  }

  async verifyEmailIsVerified():
    Promise<Result<void, VerifyEmailError>> {

    try {

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        return {
          ok: false,
          error: "unauthenticated"
        }
      }

      if (!user.email_confirmed_at) {
        return {
          ok: false,
          error: "not-verified"
        }
      }

      return {
        ok: true,
        data: undefined
      }

    } catch {

      return {
        ok: false,
        error: "unknown"
      }
    }
  }

  onAuthStateChanged(
    callback: (user: User | null) => void
  ) {

    return supabase.auth.onAuthStateChange(
      (_, session) => {
        callback(session?.user ?? null)
      }
    )
  }

  async getCurrentUser(): Promise<User | null> {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    return user
  }

  async signOut():
    Promise<Result<void, SignOutError>> {

    try {

      const { error } = await supabase.auth.signOut()

      if (error) throw error

      return {
        ok: true,
        data: undefined
      }

    } catch {

      return {
        ok: false,
        error: "unknown"
      }
    }
  }

  async passwordRecovery(
    email: string
  ): Promise<Result<void, PasswordRecoveryError>> {

    try {

      const { error } =
        await supabase.auth.resetPasswordForEmail(email)

      if (error) throw error

      return {
        ok: true,
        data: undefined
      }

    } catch {

      return {
        ok: false,
        error: "unknown"
      }
    }
  }

  async updatePassword(
    newPassword: string
  ): Promise<Result<void, UpdatePasswordError>> {

    try {

      const { error } =
        await supabase.auth.updateUser({
          password: newPassword
        })

      if (error) {
        return handleAuthError(error)
      }

      return {
        ok: true,
        data: undefined
      }

    } catch (error) {

      return handleAuthError(error)
    }
  }

}

const handleAuthError = <T>(
  error: any
): Result<T, any> => {

  console.log("AUTH ERROR:", error)

  switch (error?.message) {

    case "Invalid login credentials":
      return {
        ok: false,
        error: "invalid-credentials"
      }

    case "User already registered":
      return {
        ok: false,
        error: "email-already-in-use"
      }

    case "Password should be at least 6 characters":
      return {
        ok: false,
        error: "weak-password"
      }

    case "Email not confirmed":
      return {
        ok: false,
        error: "email-not-confirmed"
      }

    case "User not found":
      return {
        ok: false,
        error: "user-not-found"
      }

    default:
      return {
        ok: false,
        error: "unknown"
      }
  }
}


export const authRepository = new AuthRepository();