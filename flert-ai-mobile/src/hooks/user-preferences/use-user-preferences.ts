import { UserPreferences } from "@/src/screens/chat-screen";
import getUserPreferences from "@/src/services/get-user-preferences";
import updateUserPreferences from "@/src/services/update-user-preferences";
import { UpdateUserPreferencesDTO } from "@/src/types/user";
import { getLengthDescription } from "@/src/utils/get-length-description";
import { getStyleDescription } from "@/src/utils/get-style-description";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";

const useUserPreferences = () => {
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);
  const queryClient = useQueryClient()

  const useUserPreferencesQuery = () => {
    return useQuery({
      queryKey: ["userPreferences"],
      queryFn: () => getUserPreferences(),
      staleTime: 1000 * 60 * 5,
    });
  };

  const handleUpdateUserPreferences = useMutation({
    mutationFn: async ({
      personalityStyle,
      responseLength,
    }: UpdateUserPreferencesDTO) => {
      setIsUpdatingPreferences(true);
      const response = await updateUserPreferences(
        getStyleDescription(personalityStyle as UserPreferences["personalityStyle"]),
        getLengthDescription(responseLength as UserPreferences["responseLength"])
      );
      return response;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
    },
    onError: (error: any) => {
      Alert.alert(
        "Erro ao atualizar suas preferências",
        error?.response?.data?.message ||
          "Ocorreu um erro ao atualizar suas preferências."
      );
    },
    onSettled: () => {
      setIsUpdatingPreferences(false);
    },
  });
  

  return {
    useUserPreferencesQuery,
    handleUpdateUserPreferences,
    isUpdatingPreferences,
  };
};

export default useUserPreferences;
