import { authRepository } from "../../../data/repository/AuthRepository"
import { userRepository } from "../../../data/repository/UserRepository"
import { UserError } from "../../../errors/UserError"
import { Result } from "../../../shared/types/result"
import { AuthUser } from "../../models/AuthUser"

export const getUserInfoUsecase = async (
): Promise<Result<AuthUser, UserError>> => {

  const user = await authRepository.getCurrentUser()

  if (!user) {
    return { ok: false, error: "unknown" }
  }

  return await userRepository.getUser(user.uid)
}