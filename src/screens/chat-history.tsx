import useChat from '@/src/hooks/chat/use-chat';
import { formatTimestamp } from '@/src/utils/format-time-stamp';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface ChatHistory {
  id: string;
  title: string;
  createdAt: string;
}

export default function ChatHistoryScreen() {
  const { useConversationsQuery } = useChat();
  const { data: chatHistory, isLoading, error, refetch } = useConversationsQuery();

  const handleChatPress = (chat: ChatHistory) => {
    router.push({
      pathname: '/(chats)/[id]/chat',
      params: { id: chat.id }
    });
  };

  const renderChatItem = ({ item }: { item: ChatHistory }) => (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.chatHeader}>
        <View style={styles.chatLeft}>
          <View style={styles.contextIndicator}>
            <Ionicons name="chatbubbles" size={16} color="#FFFFFF" />
          </View>
          <View style={styles.chatInfo}>
            <Text style={styles.chatTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.contextLabel}>Flerte-AI</Text>
          </View>
        </View>
        <View style={styles.chatMeta}>
          <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
        </View>
      </View>
      
      <Text style={styles.lastMessage} numberOfLines={2}>
        Toque para continuar a conversa...
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateContent}>
        <Ionicons name="chatbubbles-outline" size={64} color="#CCC" />
        <Text style={styles.emptyStateTitle}>Nenhuma conversa ainda</Text>
        <Text style={styles.emptyStateSubtitle}>
          Suas conversas com a Flerte-AI aparecerão aqui
        </Text>
        <TouchableOpacity
          style={styles.startChatButton}
          onPress={() => router.push('/(main)/chat')}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.startChatButtonText}>Iniciar Nova Conversa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateContent}>
        <Ionicons name="warning-outline" size={64} color="#FF6B6B" />
        <Text style={styles.emptyStateTitle}>Erro ao carregar</Text>
        <Text style={styles.emptyStateSubtitle}>
          Não foi possível carregar suas conversas
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
        >
          <Ionicons name="refresh" size={20} color="#FF6B6B" />
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateContent}>
        <Ionicons name="hourglass" size={64} color="#FF6B6B" />
        <Text style={styles.emptyStateTitle}>Carregando conversas...</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats Passados</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => refetch()}
          >
            <Ionicons name="refresh" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : !chatHistory || chatHistory.length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={styles.content}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsText}>
              {chatHistory.length} {chatHistory.length === 1 ? 'conversa salva' : 'conversas salvas'}
            </Text>
          </View>

          <FlatList
            data={chatHistory}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshing={isLoading}
            onRefresh={refetch}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  headerRight: {
    width: 34,
    alignItems: 'flex-end',
  },
  headerButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  chatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  chatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contextIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  contextLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  chatMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateContent: {
    alignItems: 'center',
    maxWidth: 280,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  startChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  startChatButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
});