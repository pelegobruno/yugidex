import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';

export default function DetailScreen({ route, navigation }) {
  const { width } = useWindowDimensions();
  const { card } = route.params || {};

  if (!card) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Carta não encontrada.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Voltar ao Baralho</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Dicionário de tradução nativo para Tipos
  const translateType = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('effect monster')) return 'MONSTRO DE EFEITO';
    if (t.includes('normal monster')) return 'MONSTRO NORMAL';
    if (t.includes('fusion monster')) return 'MONSTRO DE FUSÃO';
    if (t.includes('synchro monster')) return 'MONSTRO SINCRO';
    if (t.includes('xyz monster')) return 'MONSTRO XYZ';
    if (t.includes('link monster')) return 'MONSTRO LINK';
    if (t.includes('ritual monster')) return 'MONSTRO DE RITUAL';
    if (t.includes('spell card')) return 'CARTA DE MAGIA';
    if (t.includes('trap card')) return 'CARTA DE ARMADILHA';
    return type.toUpperCase();
  };

  // Dicionário de tradução nativo para Raças
  const translateRace = (race = '') => {
    const map = {
      spellcaster: 'MAGO',
      dragon: 'DRAGÃO',
      warrior: 'GUERREIRO',
      fiend: 'DEMÔNIO',
      zombie: 'ZUMBI',
      machine: 'MÁQUINA',
      aqua: 'ÁGUA',
      pyro: 'PIRO',
      rock: 'ROCHA',
      'winged beast': 'BESTA ALADA',
      plant: 'PLANTA',
      insect: 'INSETO',
      thunder: 'TROVÃO',
      beast: 'BESTA',
      'beast-warrior': 'BESTA-GUERREIRO',
      dinosaur: 'DINOSSAURO',
      reptile: 'RÉPTIL',
      cyberse: 'CIBERSE',
      'sea serpent': 'SERPENTE MARINHA',
      psychic: 'PSÍQUICO',
      wyrm: 'WYRM',
      'divine-beast': 'BESTA-DIVINA',
      fairy: 'FADA',
    };
    return map[race.toLowerCase()] || race.toUpperCase();
  };

  const imageUrl = card.card_images?.[0]?.image_url || card.card_images?.[0]?.image_url_small;
  const isRowLayout = width >= 650; // Layout lado a lado da Imagem 2 para telas médias/grandes

  const typePT = translateType(card.type);
  const racePT = translateRace(card.race);
  const subHeader = card.race ? `${typePT} • ${racePT}` : typePT;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Botão de Voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Voltar ao Baralho</Text>
        </TouchableOpacity>

        {/* Container Principal (Layout idêntico à Imagem 2) */}
        <View style={[styles.cardWrapper, isRowLayout && styles.cardWrapperRow]}>
          {/* Lado Esquerdo: Carta Grande */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.cardImage} resizeMode="contain" />
          </View>

          {/* Lado Direito: Informações em Português */}
          <View style={styles.infoContainer}>
            <Text style={styles.cardTitle}>{card.name}</Text>
            <Text style={styles.cardSubHeader}>{subHeader}</Text>

            {/* Caixa de Status (ATK / DEF / ESTRELAS) */}
            {(card.atk !== undefined || card.def !== undefined || card.level || card.rank) && (
              <View style={styles.statsBar}>
                {card.atk !== undefined && (
                  <Text style={styles.statText}>
                    <Text style={styles.statLabelAtk}>ATK / </Text>
                    {card.atk}
                  </Text>
                )}
                {card.def !== undefined && (
                  <Text style={styles.statText}>
                    <Text style={styles.statLabelDef}>DEF / </Text>
                    {card.def}
                  </Text>
                )}
                {(card.level || card.rank) && (
                  <Text style={styles.statLevel}>★ {card.level || card.rank}</Text>
                )}
              </View>
            )}

            {/* Caixa de Descrição / Efeito */}
            <View style={styles.descBox}>
              <Text style={styles.descHeader}>DESCRIÇÃO / EFEITO:</Text>
              <Text style={styles.descText}>{card.desc || 'Sem descrição disponível.'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f172a' },
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, paddingBottom: 40 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 16 },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  backButtonText: { color: '#f59e0b', fontWeight: 'bold', fontSize: 14 },

  cardWrapper: {
    flexDirection: 'column',
    backgroundColor: '#172033',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 20,
    gap: 20,
  },
  cardWrapperRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 260,
    maxWidth: 320,
    alignSelf: 'center',
  },
  cardImage: {
    width: '100%',
    height: 420,
    borderRadius: 8,
  },

  infoContainer: {
    flex: 1,
    width: '100%',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  cardSubHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f59e0b',
    letterSpacing: 0.5,
    marginBottom: 16,
    textTransform: 'uppercase',
  },

  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  statText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabelAtk: {
    color: '#ef4444',
  },
  statLabelDef: {
    color: '#38bdf8',
  },
  statLevel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f59e0b',
  },

  descBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  descHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 10,
  },
  descText: {
    fontSize: 14,
    color: '#f8fafc',
    lineHeight: 22,
  },
});