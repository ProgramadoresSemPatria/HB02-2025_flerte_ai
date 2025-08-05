import { apiInstance } from "../lib/axios";
import { User } from "../types/user";

type UpdateProfileResponse = User

const updateProfile = async (data: Partial<User>) => {
  const res = await apiInstance.put<UpdateProfileResponse>("/profile", {
    data,
  });
  return res.data;
};

export default updateProfile;
