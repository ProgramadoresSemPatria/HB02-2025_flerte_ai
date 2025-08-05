import { apiInstance } from "../lib/axios";

type getUserPreferencesResponse = {
  personalityStyle: string;
  responseLength: string;
};

const getUserPreferences = async () => {
  const res = await apiInstance.get<getUserPreferencesResponse>("/preferences");
  return res.data;
};

export default getUserPreferences;
