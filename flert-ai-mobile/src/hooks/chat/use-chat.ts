import createConversation from "@/src/services/create-chat";
import createMessage from "@/src/services/create-message";
import getConversationById from "@/src/services/get-conversation-by-id";
import getConversations from "@/src/services/get-conversations";
import { generateChatTitle } from "@/src/utils/generate-chat-title";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";

const useChat = () => {
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const useConversationsQuery = () => {
    return useQuery({
      queryKey: ["conversations"],
      queryFn: () => getConversations(),
      staleTime: 1000 * 60 * 5,
    });
  };

  const useConversationsByIdQuery = (id: number) => {
    return useQuery({
      queryKey: ["conversations", id],
      queryFn: () => getConversationById(id),
      staleTime: 1000 * 60 * 5,
    });
  };

  const handleCreateChat = useMutation({
    mutationFn: async () => {
      setIsCreatingChat(true);
      const response = await createConversation(generateChatTitle());
      return response;
    },
    onSuccess: async (data) => {},
    onError: (error: any) => {
      Alert.alert(
        "Erro ao criar um chat",
        error?.response?.data?.message || "Ocorreu um erro ao criar um chat."
      );
    },
    onSettled: () => {
      setIsCreatingChat(false);
    },
  });

  const handleSendMessage = useMutation({
    mutationFn: async ({
      content,
      conversationId,
    }: {
      content: string;
      conversationId: number;
    }) => {
      const response = await createMessage(content, conversationId);
      return response;
    },
    onSuccess: async (data) => {},
    onError: (error: any) => {
      Alert.alert(
        "Erro ao enviar mensagem",
        error?.response?.data?.message ||
          "Ocorreu um erro ao enviar a mensagem. Verifique suas credenciais e tente novamente."
      );
    },
    onSettled: () => {},
  });

  return {
    handleCreateChat,
    handleSendMessage,
    isCreatingChat,
    useConversationsQuery,
    useConversationsByIdQuery,
  };
};

export default useChat;
