import useUserPreferences from '@/src/hooks/user-preferences/use-user-preferences';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getLengthFromDescription } from '../utils/get-length-description';
import { getStyleFromDescription } from '../utils/get-style-description';

type PersonalityStyleType = 'Sensual' | 'Ameno' | 'Direto';
type ResponseLengthType = 'Curta' | 'Média' | 'Longa';

interface StyleOption {
  type: PersonalityStyleType;
  title: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
}

interface LengthOption {
  type: ResponseLengthType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function ConversationStyleScreen() {
  const { handleUpdateUserPreferences, isUpdatingPreferences, useUserPreferencesQuery } = useUserPreferences();
  const { data: userPreferencesData, isLoading } = useUserPreferencesQuery();
  
  const [selectedStyle, setSelectedStyle] = useState<PersonalityStyleType | null>(null);
  const [selectedLength, setSelectedLength] = useState<ResponseLengthType | null>(null);

  useEffect(() => {
    if (userPreferencesData) {
      setSelectedStyle(userPreferencesData.personalityStyle as PersonalityStyleType);
      setSelectedLength(userPreferencesData.responseLength as ResponseLengthType);
    }
  }, [userPreferencesData]);

  const styleOptions: StyleOption[] = [
    {
      type: 'Sensual',
      title: 'Sensual',
      description: 'Tom mais provocante e sedutor, com dicas ousadas',
      icon: 'flame',
      color: '#FF6B6B',
      examples: [
        '"Que tal criar uma mensagem que desperte curiosidade?"',
        '"Vamos criar algo provocante mas elegante"',
        '"Para um toque mais sedutor, preciso saber..."',
      ],
    },
    {
      type: 'Ameno',
      title: 'Ameno',
      description: 'Abordagem suave e delicada, com calma e sutileza',
      icon: 'heart',
      color: '#4CAF50',
      examples: [
        '"Com calma e sutileza, vamos construir algo especial"',
        '"Vamos com delicadeza..."',
        '"Para um tom mais suave, me conta..."',
      ],
    },
    {
      type: 'Direto',
      title: 'Direto',
      description: 'Comunicação objetiva e direta, sem rodeios',
      icon: 'flash',
      color: '#2196F3',
      examples: [
        '"Vamos direto ao ponto então!"',
        '"Sem rodeios: você já demonstrou interesse?"',
        '"De forma direta: qual é o seu objetivo?"',
      ],
    },
  ];

  const lengthOptions: LengthOption[] = [
    {
      type: 'Curta',
      title: 'Respostas Curtas',
      description: 'Respostas concisas e diretas ao ponto',
      icon: 'chatbox',
      color: '#FF9800',
    },
    {
      type: 'Média',
      title: 'Respostas Médias',
      description: 'Equilíbrio ideal entre detalhes e objetividade',
      icon: 'chatbox-ellipses',
      color: '#9C27B0',
    },
    {
      type: 'Longa',
      title: 'Respostas Longas',
      description: 'Explicações detalhadas e completas',
      icon: 'document-text',
      color: '#607D8B',
    },
  ];

  const handleSelectStyle = (styleType: PersonalityStyleType) => {
    setSelectedStyle(styleType);
  };

  const handleSelectLength = (lengthType: ResponseLengthType) => {
    setSelectedLength(lengthType);
  };

  const handleSavePreferences = async () => {
    if (!selectedStyle || !selectedLength) {
      Alert.alert('Erro', 'Por favor, selecione um estilo e tamanho de resposta.');
      return;
    }

    try {
      await handleUpdateUserPreferences.mutateAsync({
        personalityStyle: selectedStyle,
        responseLength: selectedLength,
      });
      
      Alert.alert(
        'Sucesso!',
        `Suas preferências foram atualizadas:\n\n🎯 Estilo: ${selectedStyle}\n📝 Tamanho: ${selectedLength}`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar suas preferências. Tente novamente.'
      );
    }
  };

  const renderStyleOption = (option: StyleOption) => {
    const isSelected = selectedStyle === option.type;
    const isCurrent = userPreferencesData?.personalityStyle === option.type;

    return (
      <TouchableOpacity
        key={option.type}
        style={[
          styles.optionCard,
          isSelected && styles.selectedCard,
          { borderColor: isSelected ? option.color : '#E5E5E5' },
        ]}
        onPress={() => handleSelectStyle(option.type)}
        activeOpacity={0.7}
        disabled={isUpdatingPreferences}
      >
        <View style={styles.optionHeader}>
          <View
            style={[styles.optionIcon, { backgroundColor: option.color }]}
          >
            <Ionicons name={option.icon as any} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.optionInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Atual</Text>
                </View>
              )}
            </View>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </View>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color={option.color} />
          )}
        </View>

        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Exemplos de respostas:</Text>
          {option.examples.map((example, index) => (
            <View key={index} style={styles.exampleItem}>
              <Text style={styles.exampleText}>{example}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  const renderLengthOption = (option: LengthOption) => {
    const isSelected = selectedLength === option.type;
    const isCurrent = userPreferencesData?.responseLength === option.type;

    return (
      <TouchableOpacity
        key={option.type}
        style={[
          styles.lengthCard,
          isSelected && styles.selectedCard,
          { borderColor: isSelected ? option.color : '#E5E5E5' },
        ]}
        onPress={() => handleSelectLength(option.type)}
        activeOpacity={0.7}
        disabled={isUpdatingPreferences}
      >
        <View style={styles.optionHeader}>
          <View
            style={[styles.optionIcon, { backgroundColor: option.color }]}
          >
            <Ionicons name={option.icon as any} size={20} color="#FFFFFF" />
          </View>
          <View style={styles.optionInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.lengthTitle}>{option.title}</Text>
              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Atual</Text>
                </View>
              )}
            </View>
            <Text style={styles.lengthDescription}>{option.description}</Text>
          </View>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={20} color={option.color} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="sparkles" size={48} color="#FF6B6B" />
          <Text style={styles.loadingText}>Carregando suas preferências...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Estilo de Conversa</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#2196F3" />
            <Text style={styles.infoText}>
              Personalize como a Flerte-AI se comunica com você escolhendo o estilo e tamanho das respostas.
            </Text>
          </View>
        </View>

        {userPreferencesData && (
          <View style={styles.currentSection}>
            <Text style={styles.currentTitle}>Preferências atuais:</Text>
            <Text style={styles.currentPreferences}>
              🎯 {getStyleFromDescription(userPreferencesData.personalityStyle)} • 📝 {getLengthFromDescription(userPreferencesData.responseLength)}
            </Text>
          </View>
        )}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Estilo de Personalidade:</Text>
          {styleOptions.map(renderStyleOption)}
        </View>
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Tamanho das Respostas:</Text>
          <View style={styles.lengthGrid}>
            {lengthOptions.map(renderLengthOption)}
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!selectedStyle || !selectedLength || isUpdatingPreferences) && styles.saveButtonDisabled,
          ]}
          onPress={handleSavePreferences}
          disabled={!selectedStyle || !selectedLength || isUpdatingPreferences}
        >
          {isUpdatingPreferences ? (
            <Ionicons name="hourglass" size={20} color="#FFFFFF" />
          ) : (
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          )}
          <Text style={styles.saveButtonText}>
            {isUpdatingPreferences ? 'Salvando...' : 'Salvar Preferências'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoSection: {
    marginTop: 20,
    marginBottom: 25,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  currentSection: {
    marginBottom: 25,
  },
  currentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  currentPreferences: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  optionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  lengthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lengthGrid: {
    gap: 8,
  },
  selectedCard: {
    backgroundColor: '#F8F9FF',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  lengthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  currentBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  currentBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  lengthDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  examplesContainer: {
    marginTop: 8,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  exampleItem: {
    marginBottom: 6,
  },
  exampleText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCC',
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 30,
  },
});