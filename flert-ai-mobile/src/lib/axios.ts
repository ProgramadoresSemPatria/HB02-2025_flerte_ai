import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

apiInstance.interceptors.request.use(
  async (config) => {
    try {

      let token = await AsyncStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      
      }

      return config;
    } catch (error) {
      console.error("❌ Erro no interceptor:", error);
      return config;
    }
  }
);

export { apiInstance };
