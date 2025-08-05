import useAuth from '@/src/hooks/auth/use-auth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const personAI = require('../../assets/images/person-flert-ai.png');
export default function ProfileScreen() {

  const {user} = useAuth()
  // const { userPreference } = useUserPreferences();

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            // Aqui você implementaria a lógica de logout
            router.replace('/');
          }
        },
      ]
    );
  };

  const handlePastChats = () => {
    router.push('/(chats)/chat-history');
  };

  const handleProfile = () => {
    router.push('/(profile)/edit-profile');
  };

  const handleChangeContext = () => {
    router.push('/(profile)/conversation-style');
  };

  const menuItems = [
    {
      icon: 'chatbubbles-outline',
      title: 'Chats Passados',
      subtitle: 'Histórico de conversas com a Flerte-AI',
      action: handlePastChats,
      color: '#4CAF50',
    },
    {
      icon: 'person-outline',
      title: 'Seu Perfil',
      subtitle: 'Informações pessoais',
      action: handleProfile,
      color: '#2196F3',
    },
    {
      icon: 'color-palette-outline',
      title: 'Estilo de Conversa',
      subtitle: 'Definir preferência de contexto',
      action: handleChangeContext,
      color: '#9C27B0',
    },
    {
      icon: 'log-out-outline',
      title: 'Deslogar',
      subtitle: 'Sair da sua conta',
      action: handleLogout,
      color: '#FF6B6B',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.headerIcon}>
          <Ionicons name="person-circle-outline" size={28} color="#FF6B6B" />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View style={styles.aiAvatar}>
              <Image 
                source={personAI}
                style={{ width: 90, height: 90, borderRadius: 50 }}
                resizeMode="center"
              />
            </View>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>Olá, {user?.name}!</Text>
              <Text style={styles.welcomeSubtitle}>
                Como está sua jornada com a Flerte-AI?
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem} 
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <View style={styles.appInfoItem}>
            <Ionicons name="information-circle-outline" size={16} color="#999" />
            <Text style={styles.appInfoText}>Flerte-AI v1.0.0</Text>
          </View>
          <View style={styles.appInfoItem}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#999" />
            <Text style={styles.appInfoText}>Seus dados estão seguros</Text>
          </View>
        </View>

        {/* Assistant Card */}
        <View style={styles.assistantCard}>
          <View style={styles.assistantHeader}>
            <Ionicons name="sparkles" size={20} color="#FF6B6B" />
            <Text style={styles.assistantTitle}>Dica da Flerte-AI</Text>
          </View>
          <Text style={styles.assistantText}>
            💡 Lembre-se: a autenticidade é sempre a melhor estratégia para conquistar alguém!
          </Text>
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerIcon: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  aiAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5E5',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  menuSection: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 12,
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  appInfo: {
    marginTop: 20,
    paddingVertical: 15,
  },
  appInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appInfoText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  assistantCard: {
    backgroundColor: '#FFF8F8',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  assistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  assistantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginLeft: 8,
  },
  assistantText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
