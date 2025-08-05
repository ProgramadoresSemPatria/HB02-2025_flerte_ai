import { AuthContext } from "@/src/context/auth-context";
import createSession from "@/src/services/create-session";
import createUser from "@/src/services/create-user";
import updateProfile from "@/src/services/update-profile";
import { CreateSessionDTO } from "@/src/types/session";
import { CreateUserDTO, User } from "@/src/types/user";
import { projectConstants } from "@/src/utils/constants";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { Alert } from "react-native";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  const { user, isLogged, setIsLogged, setUser, setToken } = context;

  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handleCreateSession = useMutation({
    mutationFn: async ({ email, password }: CreateSessionDTO) => {
      setIsCreatingSession(true);
      const response = await createSession(email, password);
      return response;
    },
    onSuccess: async (data) => {
      const { token, user } = data;

      setUser(user);
      setIsLogged(true);
      setToken(token);

      await AsyncStorage.multiSet([
        [projectConstants.user, JSON.stringify(user)],
        [projectConstants.accessToken, token],
      ]);

      router.push("/(main)/home");
    },
    onError: (error: any) => {
      Alert.alert(
        "Erro ao fazer login",
        error?.response?.data?.message ||
          "Ocorreu um erro ao fazer login. Verifique suas credenciais e tente novamente."
      );
    },
    onSettled: () => {
      setIsCreatingSession(false);
    },
  });

  const handleRegisterUser = useMutation({
    mutationFn: async (data: CreateUserDTO) => {
      setIsRegisteringUser(true);
      const response = await createUser(data);
      return response;
    },
    onSuccess: () => {
      Alert.alert(
        "Cadastro realizado com sucesso",
        "Você já pode fazer login com suas credenciais."
      );
      router.push("/");
    },
    onError: (error: any) => {
      Alert.alert(
        "Erro ao cadastrar usuário",
        error?.response?.data?.message ||
          "Ocorreu um erro ao cadastrar o usuário. Tente novamente mais tarde."
      );
    },
    onSettled: () => {
      setIsRegisteringUser(false);
    },
  });

  const handleUpdateUserProfile = useMutation({
    mutationFn: async (data: Partial<User>) => {
      setIsUpdatingProfile(true)
      const response = await updateProfile(data);
      return response;
    },
    onSuccess: (data) => {
      const updatedUser = {
        ...data,
      };
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedUser,
      }));
      Alert.alert(
        "Perfil atualizado",
        "Seu perfil foi atualizado com sucesso."
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Erro ao atualizar perfil",
        error?.response?.data?.message ||
          "Ocorreu um erro ao atualizar seu perfil. Tente novamente mais tarde."
      );
    },
    onSettled: () => {
      setIsUpdatingProfile(false);
    },
  });

  return {
    handleCreateSession,
    isCreatingSession,
    isLogged,
    handleRegisterUser,
    isRegisteringUser,
    user,
    handleUpdateUserProfile,
    isUpdatingProfile,
  };
};

export default useAuth;
