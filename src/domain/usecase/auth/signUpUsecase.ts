import { authRepository } from "../../../data/repository/AuthRepository"
import { userRepository } from "../../../data/repository/UserRepository"
import { mapRegisterErrorToMessage } from "../../../errors/auth/registerError"
import { UserError } from "../../../errors/userError"
import { Result } from "../../../shared/types/result"
import { CreateUserRequest } from "../../models/CreateUserRequest"
import { employeeStatuses, roles } from "../../models/Service"
import { SignUpRequest } from "../../models/SignUpRequest"

export const signUpUsecase = async (
  input: SignUpRequest
): Promise<Result<void, UserError>> => {

  const user = await authRepository.signUp(input.email, input.password)

  if (!user.ok) {
    return { ok: false, error: mapRegisterErrorToMessage(user.error) }
  }

  const request: CreateUserRequest = {
    name: input.name,
    lastName: input.lastName,
    email: input.email,
    role: roles.USER,
    status: employeeStatuses.ACTIVE,
    uid: user.data.uid
  };

  return userRepository.createUser(request)
}