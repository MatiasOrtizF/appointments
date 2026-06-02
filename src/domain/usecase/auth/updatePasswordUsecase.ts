import { authRepository } from "../../../data/repository/AuthRepository";
import { UpdatePasswordError } from "../../../errors/auth/updatePasswordError";
import { Result } from "../../../shared/types/result";

export const updatePasswordUseCase = async (
    currentPassword: string,
    newPassword: string
): Promise<Result<void, UpdatePasswordError>> => {

    console.log("PASO 1");

    const user = await authRepository.getCurrentUser();

    console.log("PASO 2");

    if (!user) {
        return { ok: false, error: "unauthorized" }
    }

    const verifyResult =
      await authRepository.verifyCurrentPassword(
        user.email!,
        currentPassword
      );

    console.log("PASO 3", verifyResult);

    if (!verifyResult.ok) {
        console.log("PASO 4");
        return verifyResult;
    }

    console.log("PASO 5");

    const updateResult =
      await authRepository.updatePassword(newPassword);

    console.log("PASO 6", updateResult);

    return updateResult;
};