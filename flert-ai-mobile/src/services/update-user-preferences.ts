import { apiInstance } from "../lib/axios";

const updateUserPreferences = async (
  personalityStyle: string,
  responseLength: string
) => {
  const res = await apiInstance.put("/preferences", {
    personalityStyle,
    responseLength,
  });
  return res.data;
};

export default updateUserPreferences;
