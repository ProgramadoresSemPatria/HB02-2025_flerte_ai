import useChat from "@/src/hooks/chat/use-chat";
import useUserPreferences from "@/src/hooks/user-preferences/use-user-preferences";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getLengthFromDescription } from "../utils/get-length-description";
import { getStyleFromDescription } from "../utils/get-style-description";

const personAI = require("../../assets/images/person-flert-ai.png");
const { width } = Dimensions.get("window");

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface UserPreferences {
  responseLength: "Curta" | "Média" | "Longa";
  personalityStyle: "Sensual" | "Ameno" | "Direto";
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences | null>(null);
  const {
    handleUpdateUserPreferences,
    isUpdatingPreferences,
    useUserPreferencesQuery,
  } = useUserPreferences();
  const {
    handleCreateChat: handleCreateChatForAPI,
    handleSendMessage: handleSendMessageForAPI,
  } = useChat();
  const [conversationId, setConversationId] = useState<number | null>(null);

  const { data: userPreferencesData, isLoading } = useUserPreferencesQuery();

  const [tempPreferences, setTempPreferences] = useState<UserPreferences>({
    responseLength: "Média",
    personalityStyle: "Ameno",
  });
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!isLoading) {
      if (userPreferencesData) {
        setUserPreferences({
          responseLength:
            userPreferencesData.responseLength as UserPreferences["responseLength"],
          personalityStyle:
            userPreferencesData.personalityStyle as UserPreferences["personalityStyle"],
        });
        setShowPreferencesModal(false);
      } else {
        setShowPreferencesModal(true);
        setUserPreferences(null);
      }
    }
  }, [userPreferencesData, isLoading]);

  const handleCreateChat = async () => {
    if (!userPreferences) {
      setShowPreferencesModal(true);
      return;
    }

    await handleCreateChatForAPI.mutateAsync().then((response) => {
      setHasStartedChat(true);
      setConversationId(response.id)
      setMessages([
        {
          id: "1",
          text: `Olá! Eu sou a Flerte-AI, sua assistente virtual de flerte!\n\n🎯 Estilo: ${getStyleFromDescription(userPreferences.personalityStyle)}\n📝 Respostas: ${getLengthFromDescription(userPreferences.responseLength)}\n\nComo posso te ajudar hoje?`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    });
  };

  const handleSavePreferences = async () => {
    try {
      await handleUpdateUserPreferences.mutateAsync(tempPreferences);

      setUserPreferences(tempPreferences);
      setShowPreferencesModal(false);
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar suas preferências. Tente novamente."
      );
    }
  };

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
        conversationId:conversationId as number,
      });

      const aiResponse: Message = {
        id: response.id.toString(),
        text: response.content,
        isUser: false,
        timestamp: new Date(response.createdAt),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);

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
      "Novo Chat",
      "Deseja iniciar uma nova conversa? A conversa atual será arquivada.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim",
          onPress: () => {
            setMessages([
              {
                id: Date.now().toString(),
                text: "Nova conversa iniciada! Como posso te ajudar agora? 😊",
                isUser: false,
                timestamp: new Date(),
              },
            ]);
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

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateContent}>
        <View style={styles.emptyStateAvatar}>
          <Image
            source={personAI}
            style={{ width: 80, height: 80, borderRadius: 40 }}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.emptyStateTitle}>Flerte-AI</Text>
        <Text style={styles.emptyStateSubtitle}>
          Sua assistente virtual de flerte está pronta para te ajudar!
        </Text>

        <TouchableOpacity
          style={styles.createChatButton}
          onPress={handleCreateChat}
        >
          <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
          <Text style={styles.createChatButtonText}>
            Criar chat com a Flerte AI
          </Text>
        </TouchableOpacity>

        {userPreferences && (
          <View style={styles.preferencesPreview}>
            <Text style={styles.preferencesTitle}>Suas preferências:</Text>
            <Text style={styles.preferencesText}>
              🎯 {getStyleFromDescription(userPreferences.personalityStyle)} • 📝{" "}
              {getLengthFromDescription(userPreferences.responseLength)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderPreferencesModal = () => (
    <Modal
      visible={showPreferencesModal && !isLoading}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Ionicons name="sparkles" size={24} color="#FF6B6B" />
            <Text style={styles.modalTitle}>Configure suas Preferências</Text>
            <Text style={styles.modalSubtitle}>
              Personalize a Flerte-AI para uma experiência única
            </Text>
          </View>

          <View style={styles.preferenceSection}>
            <Text style={styles.sectionTitle}>Estilo de Personalidade</Text>
            <View style={styles.optionsContainer}>
              {(["Sensual", "Ameno", "Direto"] as const).map((style) => (
                <TouchableOpacity
                  key={style}
                  style={[
                    styles.optionCard,
                    tempPreferences.personalityStyle === style &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    setTempPreferences((prev) => ({
                      ...prev,
                      personalityStyle: style,
                    }))
                  }
                  disabled={isUpdatingPreferences}
                >
                  <Ionicons
                    name={
                      style === "Sensual"
                        ? "flame"
                        : style === "Ameno"
                          ? "heart"
                          : "flash"
                    }
                    size={20}
                    color={
                      tempPreferences.personalityStyle === style
                        ? "#FFFFFF"
                        : "#FF6B6B"
                    }
                  />
                  <Text
                    style={[
                      styles.optionText,
                      tempPreferences.personalityStyle === style &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {style}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      tempPreferences.personalityStyle === style &&
                        styles.selectedOptionDescription,
                    ]}
                  >
                    {style === "Sensual"
                      ? "Provocante e sedutor"
                      : style === "Ameno"
                        ? "Suave e carinhoso"
                        : "Objetivo e direto"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.preferenceSection}>
            <Text style={styles.sectionTitle}>Tamanho das Respostas</Text>
            <View style={styles.optionsContainer}>
              {(["Curta", "Média", "Longa"] as const).map((length) => (
                <TouchableOpacity
                  key={length}
                  style={[
                    styles.optionCard,
                    tempPreferences.responseLength === length &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    setTempPreferences((prev) => ({
                      ...prev,
                      responseLength: length,
                    }))
                  }
                  disabled={isUpdatingPreferences}
                >
                  <Ionicons
                    name={
                      length === "Curta"
                        ? "chatbox"
                        : length === "Média"
                          ? "chatbox-ellipses"
                          : "document-text"
                    }
                    size={20}
                    color={
                      tempPreferences.responseLength === length
                        ? "#FFFFFF"
                        : "#FF6B6B"
                    }
                  />
                  <Text
                    style={[
                      styles.optionText,
                      tempPreferences.responseLength === length &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {length}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      tempPreferences.responseLength === length &&
                        styles.selectedOptionDescription,
                    ]}
                  >
                    {length === "Curta"
                      ? "Respostas concisas"
                      : length === "Média"
                        ? "Equilibrio ideal"
                        : "Explicações detalhadas"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              isUpdatingPreferences && styles.saveButtonDisabled,
            ]}
            onPress={handleSavePreferences}
            disabled={isUpdatingPreferences}
          >
            {isUpdatingPreferences ? (
              <Ionicons name="hourglass" size={20} color="#FFFFFF" />
            ) : (
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            )}
            <Text style={styles.saveButtonText}>
              {isUpdatingPreferences ? "Salvando..." : "Salvar Preferências"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Mostrar loading enquanto carrega as preferências
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingScreen}>
          <Ionicons name="sparkles" size={48} color="#FF6B6B" />
          <Text style={styles.loadingText}>
            Carregando suas preferências...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Image
              source={personAI}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              resizeMode="cover"
            />
          </View>
          <View>
            <Text style={styles.headerTitle}>Flerte-AI</Text>
            <Text style={styles.headerSubtitle}>
              {userPreferences
                ? `${getStyleFromDescription(userPreferences.personalityStyle)} • ${getLengthFromDescription(userPreferences.responseLength)}`
                : "Configurando..."}
            </Text>
          </View>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleAddPhoto}
          >
            <Ionicons name="camera" size={20} color="#FF6B6B" />
          </TouchableOpacity>
          {hasStartedChat && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleNewChat}
            >
              <Ionicons name="add" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Empty State ou Messages */}
      {!hasStartedChat ? (
        renderEmptyState()
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          />

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
                <Text style={styles.typingText}>
                  Flerte-AI está digitando...
                </Text>
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
        </>
      )}

      {/* Preferences Modal */}
      {renderPreferencesModal()}
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
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyStateContent: {
    alignItems: "center",
    maxWidth: 320,
  },
  emptyStateAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#FF6B6B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyStateTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  createChatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#FF6B6B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createChatButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  preferencesPreview: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },
  preferencesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  preferencesText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  // Existing styles...
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: width - 40,
    maxHeight: "80%",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  preferenceSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 8,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    backgroundColor: "#F8F9FA",
  },
  selectedOption: {
    borderColor: "#FF6B6B",
    backgroundColor: "#FF6B6B",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  selectedOptionText: {
    color: "#FFFFFF",
  },
  optionDescription: {
    fontSize: 12,
    color: "#666",
    marginLeft: "auto",
  },
  selectedOptionDescription: {
    color: "#FFFFFF",
    opacity: 0.8,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#E5E5E5",
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
