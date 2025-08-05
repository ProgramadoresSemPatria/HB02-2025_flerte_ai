import { apiInstance } from "../lib/axios";
import { CreateUserDTO, User } from "../types/user";

type CreateUserResponse = {
  user: User;
};

const createUser = async ({ email, name, password }: CreateUserDTO) => {
  const res = await apiInstance.post<CreateUserResponse>("/auth/register", {
    email,
    name,
    password,
  });
  return res.data;
};

export default createUser;
