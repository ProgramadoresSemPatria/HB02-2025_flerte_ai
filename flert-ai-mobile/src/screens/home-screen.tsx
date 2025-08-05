import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
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

export default function HomeScreen() {
  const handleStartConversation = () => {
    router.push('/chat');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.assistantContainer}>
            <View style={styles.assistantAvatar}>
              <Image 
                source={personAI}
                style={{ width: 100, height: 100, borderRadius: 50 }}
                resizeMode="center"
              />
            </View>
            <View style={styles.pulseRing} />
          </View>
        </View>

        <View style={styles.introSection}>
          <Text style={styles.greeting}>Olá! Eu sou a</Text>
          <Text style={styles.appName}>Flerte-AI</Text>
          <Text style={styles.subtitle}>
            Sua assistente virtual de flerte 
          </Text>
          
          <View style={styles.descriptionCard}>
            <Text style={styles.description}>
              Sou seu copiloto pessoal para conquistar seu crush! 
              Posso te ajudar com:
            </Text>
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#FF6B6B" />
                <Text style={styles.featureText}>Criar mensagens irresistíveis</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Ionicons name="bulb" size={20} color="#FF6B6B" />
                <Text style={styles.featureText}>Sugerir tópicos de conversa</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Ionicons name="heart" size={20} color="#FF6B6B" />
                <Text style={styles.featureText}>Dicas de conquista personalizadas</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Ionicons name="analytics" size={20} color="#FF6B6B" />
                <Text style={styles.featureText}>Analisar conversas e dar feedback</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartConversation}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="chatbubble" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Começar Conversa</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.examplesSection}>
          <Text style={styles.examplesTitle}>Exemplos do que posso fazer:</Text>
          
          <View style={styles.exampleCard}>
            <View style={styles.exampleHeader}>
              <Ionicons name="chatbubble-outline" size={16} color="#FF6B6B" />
              <Text style={styles.exampleLabel}>Mensagem sugerida</Text>
            </View>
            <Text style={styles.exampleText}>
              &quot;Oi! Vi que você gosta de [hobby]. Coincidência, eu também adoro! 
              Qual foi sua última aventura com isso?&quot;
            </Text>
          </View>
          
          <View style={styles.exampleCard}>
            <View style={styles.exampleHeader}>
              <Ionicons name="bulb-outline" size={16} color="#FF6B6B" />
              <Text style={styles.exampleLabel}>Dica personalizada</Text>
            </View>
            <Text style={styles.exampleText}>
              &quot;Para conquistar alguém que gosta de livros, pergunte sobre o último 
              livro que ela leu e compartilhe sua opinião!&quot;
            </Text>
          </View>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  assistantContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistantAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 2,
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    opacity: 0.3,
    zIndex: 1,
  },
  introSection: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  featuresList: {
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  actionSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  startButton: {
    position: 'relative',
    backgroundColor: '#FF6B6B',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 40,
    marginBottom: 15,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buttonGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
    opacity: 0.4,
    top: 4,
    left: 0,
    zIndex: -1,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    maxWidth: 280,
  },
  examplesSection: {
    paddingTop: 20,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  exampleCard: {
    backgroundColor: '#FFF8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  exampleText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
