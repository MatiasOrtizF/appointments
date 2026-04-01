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

export class AuthRepository {
  async login(email: string, password: string): Promise<User | null> {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const user = credential.user

      if (!user) {
        throw new Error("User is null after successful login")
      }

      return user
    } catch (error) {
      throw error
    }
  }

  async signUp(email: string, password: string): Promise<User | null> {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)

      const user = credential.user

      if (!user) {
        throw new Error("Usuario nulo")
      }

      await sendEmailVerification(user)

      return user
    } catch (error: any) {

      if (error.code === "auth/email-already-in-use") {
        throw new Error("El email que ingresaste ya esta registrado.")
      }
      throw error
    }
  }

  async sendVerificationEmail(): Promise<boolean> {
    try {
      const user = auth.currentUser
      console.log(user)
      if (!user) {
        console.log("No authenticated user")

        return false
      }

      await sendEmailVerification(user)

      console.log("Verification email sent to:", user.email)
      return true
    } catch (error) {

      console.log("Error sending verification email:", error)

      return false
    }
  }

  async verifyEmailIsVerified(): Promise<boolean> {
    try {

      const user = auth.currentUser
      if (!user) return false

      await reload(user)

      console.log(user.email)
      console.log(user.emailVerified)
      return user.emailVerified === true

    } catch {
      return false
    }
  }

  async onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback);
  }

  async getCurrentUser(): Promise<User | null> {
    return auth.currentUser
  }

  async signOut(): Promise<void> {
    await signOut(auth)
  }

  async passwordRecovery(email: string): Promise<boolean> {
    try {
      await sendPasswordResetEmail(auth, email)
      return true
    } catch (error: any) {

      if (error.code === "auth/user-not-found") {
        throw new Error("El usuario no está registrado.")
      }

      if (error.code === "auth/invalid-email") {
        throw new Error("El email no es válido.")
      }

      throw new Error("No se pudo enviar el correo de recuperación. Intenta más tarde.")
    }
  }


  async updatePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<boolean | null> {
    console.log("actualizando contraseña")
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("No hay usuario autenticado");
      }

      const email = user.email;

      if (!email) {
        throw new Error("El email del usuario es nulo");
      }

      // ⏱️ Timeout de 10 segundos
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 10000)
      );

      const updatePromise = (async (): Promise<boolean> => {
        const credential = EmailAuthProvider.credential(email, currentPassword);

        // 🔐 Reautenticación
        await reauthenticateWithCredential(user, credential);

        // 🔑 Actualizar contraseña (IMPORTANTE: alias)
        await updatePassword(user, newPassword);

        return true;
      })();

      const result = await Promise.race([updatePromise, timeoutPromise]);

      return result;
    } catch (error: any) {

      if (error.code === "auth/invalid-credential") {
        throw new Error("La contraseña actual que ingresaste no es correcta");
      }

      if (error.code === "auth/wrong-password") {
        throw new Error("La contraseña actual es incorrecta.");
      }

      if (error.code === "auth/weak-password") {
        throw new Error("La nueva contraseña es demasiado débil.");
      }

      console.log(error)
      throw new Error("No se pudo actualizar la contraseña. Intenta más tarde.");
    }
  }

}

export const authRepository = new AuthRepository();