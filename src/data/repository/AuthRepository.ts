import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  reload,
  User,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth"

import { auth } from "../../config/Firebase"
import { Result } from "../../shared/types/result"
import { FirebaseError } from "firebase/app"
import { LoginError } from "../../errors/auth/loginErrors"
import { RegisterError } from "../../errors/auth/registerError"
import { VerificationEmailError, VerificationEmailResult } from "../../errors/auth/verificationEmailError"
import { VerifyEmailError } from "../../errors/auth/VerifyEmailError"
import { PasswordRecoveryError, PasswordRecoveryResult } from "../../errors/auth/passwordRecoveryError"
import { UpdatePasswordError } from "../../errors/auth/updatePasswordError"
import { SignOutError } from "../../errors/auth/signOutError"

export class AuthRepository {
  async login(email: string, password: string): Promise<Result<User, LoginError>> {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const user = credential.user

      if (!user) {
        throw new Error("User is null after successful login")
      }

      return {
        ok: true,
        data: user,
      };

    } catch (error) {

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
            return {
              ok: false,
              error: "invalid-credentials"
            }

          case "auth/user-not-found":
            return {
              ok: false,
              error: "user-not-found"
            }

          case "auth/wrong-password":
            return {
              ok: false,
              error: "wrong-password"
            }

          case "auth/invalid-email":
            return {
              ok: false,
              error: "invalid-email"
            }

          case "auth/user-disabled":
            return {
              ok: false,
              error: "user-disabled"
            }

          case "auth/too-many-requests":
            return {
              ok: false,
              error: "too-many-requests"
            }

          case "auth/network-request-failed":
            return {
              ok: false,
              error: "network"
            }

          default:
            return {
              ok: false,
              error: "unknown"
            }
        }
      }

      if (error instanceof Error && error.message === "Timeout") {
        return { ok: false, error: "timeout" }
      }

      return { ok: false, error: "unknown" }

    }
  }

  async signUp(email: string, password: string): Promise<Result<User, RegisterError>> {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      const user = credential.user

      if (!user) {
        throw new Error("User is null after successful sign up")
      }

      await sendEmailVerification(user)

      return {
        ok: true,
        data: user,
      };

    } catch (error: any) {

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            return {
              ok: false,
              error: "email-already-in-use"
            }

          case "auth/weak-password":
            return {
              ok: false,
              error: "weak-password"
            }

          case "auth/invalid-email":
            return {
              ok: false,
              error: "invalid-email"
            }

          case "auth/network-request-failed":
            return {
              ok: false,
              error: "network"
            }

          case "auth/too-many-requests":
            return {
              ok: false,
              error: "too-many-requests"
            }

          default:
            return {
              ok: false,
              error: "unknown"
            }
        }
      }

      if (error instanceof Error && error.message === "Timeout") {
        return {
          ok: false,
          error: "timeout"
        }
      }

      return {
        ok: false,
        error: "unknown"
      }
    }
  }

  async sendVerificationEmail(): Promise<Result<void, VerificationEmailError>> {
    try {
      const user = auth.currentUser

      if (!user) {
        return {
          ok: false,
          error: "unauthenticated"
        }
      }

      await sendEmailVerification(user)

      return {
        ok: true,
        data: undefined
      }
    } catch (error) {

      if (error instanceof FirebaseError) {
        switch (error.code) {

          case "auth/user-disabled":
            return {
              ok: false,
              error: "user-disabled"
            }

          case "auth/too-many-requests":
            return {
              ok: false,
              error: "too-many-requests"
            }

          case "auth/requires-recent-login":
            return {
              ok: false,
              error: "requires-recent-login"
            }

          case "auth/network-request-failed":
            return {
              ok: false,
              error: "network"
            }

          default:
            return {
              ok: false,
              error: "unknown"
            }
        }
      }

      if (
        error instanceof Error &&
        error.message === "Timeout"
      ) {
        return {
          ok: false,
          error: "timeout"
        }
      }

      return {
        ok: false,
        error: "unknown"
      }
    }
  }

  async verifyEmailIsVerified(): Promise<Result<void, VerifyEmailError>> {
    try {
      const user = auth.currentUser

      if (!user) {
        return {
          ok: false,
          error: "unauthenticated"
        }
      }

      await reload(user)

      return {
        ok: true,
        data: undefined
      }

    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/network-request-failed":
            return {
              ok: false,
              error: "network"
            }

          default:
            return {
              ok: false,
              error: "unknown"
            }
        }
      }

      if (
        error instanceof Error &&
        error.message === "Timeout"
      ) {
        return {
          ok: false,
          error: "timeout"
        }
      }

      return {
        ok: false,
        error: "unknown"
      }
    }
  }

  async onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback);
  }

  async getCurrentUser(): Promise<User | null> {
    return auth.currentUser
  }

  async signOut(): Promise<Result<void, SignOutError>> {
    try {
      await signOut(auth)

      return {
        ok: true,
        data: undefined
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Timeout"
      ) {
        return {
          ok: false,
          error: "timeout"
        }
      }

      return {
        ok: false,
        error: "unknown"
      }
    }
  }

  async passwordRecovery(email: string): Promise<Result<void, PasswordRecoveryError>> {
    try {
      await sendPasswordResetEmail(auth, email)

      return {
        ok: true,
        data: undefined
      }

    } catch (error) {

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            return {
              ok: false,
              error: "user-not-found"
            }

          case "auth/invalid-email":
            return {
              ok: false,
              error: "invalid-email"
            }

          case "auth/too-many-requests":
            return {
              ok: false,
              error: "too-many-requests"
            }

          case "auth/network-request-failed":
            return {
              ok: false,
              error: "network"
            }

          default:
            return {
              ok: false,
              error: "unknown"
            }
        }
      }

      return {
        ok: false,
        error: "unknown"
      }
    }
  }


  async updatePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<Result<void, UpdatePasswordError>> {

    try {
      const user = auth.currentUser;

      if (!user) {
        return {
          ok: false,
          error: "unauthenticated"
        }
      }

      const email = user.email;

      if (!email) {
        return {
          ok: false,
          error: "unknown"
        }
      }

      // ⏱️ Timeout de 10 segundos
      const timeoutPromise = new Promise<never>(
        (_, reject) =>
          setTimeout(
            () => reject(new Error("Timeout")),
            10000
          )
      )
      /*const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 10000)
      );*/


      const updatePromise = (async () => {
        const credential = EmailAuthProvider.credential(email, currentPassword);

        // 🔐 Reautenticación
        await reauthenticateWithCredential(user, credential);

        // 🔑 Actualizar contraseña (IMPORTANTE: alias)
        await updatePassword(user, newPassword);
      })();

      await Promise.race([updatePromise, timeoutPromise]);

      return {
        ok: true,
        data: undefined
      }

    } catch (error) {

      if (error instanceof FirebaseError) {
        switch (error.code) {

          case "auth/invalid-credential":
          case "auth/wrong-password":
            return {
              ok: false,
              error: "invalid-credential"
            }

          case "auth/weak-password":
            return {
              ok: false,
              error: "weak-password"
            }

          case "auth/requires-recent-login":
            return {
              ok: false,
              error: "requires-recent-login"
            }

          case "auth/network-request-failed":
            return {
              ok: false,
              error: "network"
            }

          default:
            return {
              ok: false,
              error: "unknown"
            }
        }
      }

      if (
        error instanceof Error &&
        error.message === "Timeout"
      ) {
        return {
          ok: false,
          error: "timeout"
        }
      }

      return {
        ok: false,
        error: "unknown"
      }
    }
  }

}

export const authRepository = new AuthRepository();