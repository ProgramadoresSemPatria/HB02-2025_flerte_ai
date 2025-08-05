import useChat from "@/src/hooks/chat/use-chat";
import useUserPreferences from "@/src/hooks/user-preferences/use-user-preferences";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const personAI = require("../../assets/images/person-flert-ai.png");

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatByIdScreen({ id }: { id: string }) {
  const conversationId = parseInt(id || "0");

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [conversationTitle, setConversationTitle] = useState("");

  const { useUserPreferencesQuery } = useUserPreferences();
  const { data: userPreferencesData } = useUserPreferencesQuery();

  const {
    useConversationsByIdQuery,
    handleSendMessage: handleSendMessageForAPI,
  } = useChat();

  const {
    data: conversationData,
    isLoading: isLoadingConversation,
    error: conversationError,
    refetch,
  } = useConversationsByIdQuery(conversationId);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (conversationData && Array.isArray(conversationData)) {

      setConversationTitle(`Chat ${conversationId}`);

      const formattedMessages: Message[] = conversationData.map((msg: any) => ({
        id: msg.id.toString(),
        text: msg.content,
        isUser: msg.sender === 0,
        timestamp: new Date(msg.createdAt),
      }));

      setMessages(formattedMessages);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversationData, conversationId]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText("");
    setIsLoadingMessage(true);

    try {
      const response = await handleSendMessageForAPI.mutateAsync({
        content: messageText,
        conversationId: conversationId,
      });

      const aiResponse: Message = {
        id: response.id.toString(),
        text: response.content,
        isUser: false,
        timestamp: new Date(response.createdAt),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("❌ Erro ao enviar mensagem:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      Alert.alert(
        "Erro de Conexão",
        "Não foi possível enviar sua mensagem. Verifique sua conexão e tente novamente."
      );
    } finally {
      setIsLoadingMessage(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleNewChat = () => {
    Alert.alert(
      "Nova Conversa",
      "Deseja iniciar uma nova conversa? Você será redirecionado para o chat principal.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim",
          onPress: () => {
            router.push("/(main)/chat");
          },
        },
      ]
    );
  };

  const handleAddPhoto = () => {
    Alert.alert("Adicionar Foto", "Escolha uma opção:", [
      { text: "Câmera", onPress: () => console.log("Abrir câmera") },
      { text: "Galeria", onPress: () => console.log("Abrir galeria") },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const handleRefresh = () => {
    console.log("🔄 Atualizando conversa...");
    refetch();
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {!item.isUser && (
        <View style={styles.aiAvatar}>
          <Image
            source={personAI}
            style={{ width: 32, height: 32, borderRadius: 16 }}
            resizeMode="cover"
          />
        </View>
      )}

      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userText : styles.aiText,
          ]}
        >
          {item.text}
        </Text>

        <Text
          style={[
            styles.timestamp,
            item.isUser ? styles.userTimestamp : styles.aiTimestamp,
          ]}
        >
          {item.timestamp.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingScreen}>
      <Ionicons name="sparkles" size={48} color="#FF6B6B" />
      <Text style={styles.loadingText}>Carregando conversa...</Text>
      <Text style={styles.loadingSubtext}>ID: {conversationId}</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.loadingScreen}>
      <Ionicons name="warning-outline" size={48} color="#FF6B6B" />
      <Text style={styles.loadingText}>Erro ao carregar conversa</Text>
      <Text style={styles.loadingSubtext}>
        {conversationError?.message || "Conversa não encontrada"}
      </Text>
      <View style={styles.errorButtons}>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Ionicons name="refresh" size={20} color="#FFFFFF" />
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#666" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyMessages = () => (
    <View style={styles.emptyMessagesContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color="#CCC" />
      <Text style={styles.emptyMessagesTitle}>Conversa vazia</Text>
      <Text style={styles.emptyMessagesSubtitle}>
        Seja o primeiro a enviar uma mensagem!
      </Text>
    </View>
  );

  // Estados de loading/error
  if (isLoadingConversation) {
    return (
      <SafeAreaView style={styles.container}>
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  if (conversationError || !conversationData) {
    return (
      <SafeAreaView style={styles.container}>{renderErrorState()}</SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Image
              source={personAI}
              style={{ width: 32, height: 32, borderRadius: 16 }}
              resizeMode="cover"
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {conversationTitle}
            </Text>
            <Text style={styles.headerSubtitle}>
              {userPreferencesData
                ? `${userPreferencesData.personalityStyle} • ${userPreferencesData.responseLength}`
                : "Flerte-AI"}
            </Text>
          </View>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={handleRefresh}>
            <Ionicons name="refresh" size={20} color="#FF6B6B" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleAddPhoto}
          >
            <Ionicons name="camera" size={20} color="#FF6B6B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleNewChat}>
            <Ionicons name="add" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      {messages.length === 0 ? (
        renderEmptyMessages()
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          refreshing={isLoadingConversation}
          onRefresh={handleRefresh}
        />
      )}

      {/* Loading indicator */}
      {isLoadingMessage && (
        <View style={styles.loadingContainer}>
          <View style={styles.aiAvatar}>
            <Image
              source={personAI}
              style={{ width: 32, height: 32, borderRadius: 16 }}
              resizeMode="cover"
            />
          </View>
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>Flerte-AI está digitando...</Text>
            <View style={styles.typingDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>
      )}

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoadingMessage}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? "#FFFFFF" : "#CCC"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  errorButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  emptyMessagesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyMessagesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessagesSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerBackButton: {
    padding: 5,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 15,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end",
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  aiMessage: {
    justifyContent: "flex-start",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 20,
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: "#FF6B6B",
    marginLeft: "auto",
    borderBottomRightRadius: 6,
  },
  aiBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "#FFFFFF",
  },
  aiText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: "#FFFFFF",
    opacity: 0.8,
  },
  aiTimestamp: {
    color: "#666",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  typingIndicator: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typingText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 4,
  },
  typingDots: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#CCC",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    color: "#333",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#E5E5E5",
  },
});
