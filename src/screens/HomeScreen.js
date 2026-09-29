import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  ScrollView,
  BackHandler,
  Platform,
} from 'react-native';
import CardItem from '../components/CardItem';

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [selectedRace, setSelectedRace] = useState('all');
  const [selectedAttribute, setSelectedAttribute] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Modais dos Filtros
  const [modalRaceVisible, setModalRaceVisible] = useState(false);
  const [modalAttrVisible, setModalAttrVisible] = useState(false);
  const [modalLevelVisible, setModalLevelVisible] = useState(false);

  // Responsividade de colunas
  const numColumns = width < 500 ? 2 : width < 768 ? 3 : width < 1024 ? 4 : 6;

  const cardRaces = [
    'all', 'Dragon', 'Spellcaster', 'Warrior', 'Fiend', 'Zombie', 'Machine',
    'Aqua', 'Pyro', 'Rock', 'Winged Beast', 'Plant', 'Insect', 'Thunder',
    'Beast', 'Beast-Warrior', 'Dinosaur', 'Reptile', 'Cyberse', 'Sea Serpent',
    'Psychic', 'Wyrm', 'Divine-Beast', 'Normal', 'Continuous', 'Equip',
    'Quick-Play', 'Field', 'Ritual', 'Counter',
  ];

  // Previne a saída pelo botão Voltar
  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    if (Platform.OS === 'web') {
      window.history.pushState(null, '', window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, '', window.location.href);
      };
      window.addEventListener('popstate', handlePopState);

      return () => {
        backHandler.remove();
        window.removeEventListener('popstate', handlePopState);
      };
    }

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    applyFilters(searchQuery, selectedRace, selectedAttribute, selectedLevel);
  }, [searchQuery, selectedRace, selectedAttribute, selectedLevel, cards]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      // Busca a base completa sem restrições de idioma para desbloquear todas as 14.500+ cartas
      const response = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php');
      const data = await response.json();

      if (data && data.data) {
        // Remove apenas a entrada corrompida/dummy "???"
        const validCards = data.data.filter(
          (card) => card.name && card.name.trim() !== '???' && !card.name.includes('???')
        );

        // Ordena o baralho inteiro de A a Z
        validCards.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));

        setCards(validCards);
        setFilteredCards(validCards);
      }
    } catch (error) {
      console.error('Erro ao carregar cartas:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (query, race, attribute, level) => {
    let result = cards;

    // 1. Pesquisa por Nome ou ID
    if (query.trim() !== '') {
      result = result.filter(
        (card) =>
          card.name.toLowerCase().includes(query.toLowerCase()) ||
          card.id.toString().includes(query)
      );
    }

    // 2. Filtro por Raça
    if (race !== 'all') {
      result = result.filter((card) => card.race?.toLowerCase() === race.toLowerCase());
    }

    // 3. Filtro por Atributo
    if (attribute !== 'all') {
      result = result.filter((card) => card.attribute?.toUpperCase() === attribute.toUpperCase());
    }

    // 4. Filtro por Nível / Estrelas
    if (level !== 'all') {
      result = result.filter((card) => card.level === parseInt(level) || card.rank === parseInt(level));
    }

    setFilteredCards(result);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRace('all');
    setSelectedAttribute('all');
    setSelectedLevel('all');
  };

  const isFilterActive =
    selectedRace !== 'all' ||
    selectedAttribute !== 'all' ||
    selectedLevel !== 'all' ||
    searchQuery !== '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>YuG!Dek</Text>

        {/* Campo de Pesquisa */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Procurar por nome ou ID"
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Barra de Filtros */}
        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            <TouchableOpacity
              style={[styles.filterButton, selectedRace !== 'all' && styles.filterButtonActive]}
              onPress={() => setModalRaceVisible(true)}
            >
              <Text style={styles.filterButtonText}>
                🧬 {selectedRace === 'all' ? 'Raças' : selectedRace}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, selectedAttribute !== 'all' && styles.filterButtonActive]}
              onPress={() => setModalAttrVisible(true)}
            >
              <Text style={styles.filterButtonText}>
                🧙 {selectedAttribute === 'all' ? 'Atributos' : selectedAttribute}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, selectedLevel !== 'all' && styles.filterButtonActive]}
              onPress={() => setModalLevelVisible(true)}
            >
              <Text style={styles.filterButtonText}>
                ⭐ {selectedLevel === 'all' ? 'Estrelas' : `${selectedLevel} ★`}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Limpar Filtros */}
        {isFilterActive && (
          <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.resetButtonText}>Limpar Filtros ✕</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.counterText}>
          Exibindo {filteredCards.length} de {cards.length} cartas liberadas
        </Text>

        {/* Lista de Cartas em Ordem Alfabética */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f59e0b" />
            <Text style={styles.loadingText}>A carregar baralho completo em ordem alfabética...</Text>
          </View>
        ) : (
          <FlatList
            key={numColumns}
            data={filteredCards}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? styles.row : null}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <CardItem
                card={item}
                onPress={() => navigation.navigate('Detail', { card: item })}
              />
            )}
          />
        )}

        {/* Modal: Raças */}
        <Modal visible={modalRaceVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filtrar por Raça</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                {cardRaces.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={styles.modalOption}
                    onPress={() => {
                      setSelectedRace(r);
                      setModalRaceVisible(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>
                      {r === 'all' ? 'Todas as Raças' : r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalRaceVisible(false)}
              >
                <Text style={styles.modalCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal: Atributos */}
        <Modal visible={modalAttrVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filtrar por Atributo</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                {['all', 'DARK', 'LIGHT', 'WATER', 'FIRE', 'EARTH', 'WIND', 'DIVINE'].map((attr) => (
                  <TouchableOpacity
                    key={attr}
                    style={styles.modalOption}
                    onPress={() => {
                      setSelectedAttribute(attr);
                      setModalAttrVisible(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>
                      {attr === 'all' ? 'Todos os Atributos' : attr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalAttrVisible(false)}
              >
                <Text style={styles.modalCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal: Estrelas */}
        <Modal visible={modalLevelVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filtrar por Estrelas</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                {['all', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    style={styles.modalOption}
                    onPress={() => {
                      setSelectedLevel(lvl);
                      setModalLevelVisible(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>
                      {lvl === 'all' ? 'Todas as Estrelas' : `${lvl} ★`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalLevelVisible(false)}
              >
                <Text style={styles.modalCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f172a' },
  container: { flex: 1, backgroundColor: '#0f172a', paddingHorizontal: 14, paddingTop: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f59e0b', textAlign: 'center', marginBottom: 14 },
  searchContainer: { marginBottom: 10 },
  searchInput: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 14,
  },
  filterWrapper: { height: 44, marginBottom: 10 },
  filterContainer: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  filterButton: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  filterButtonActive: { borderColor: '#f59e0b', backgroundColor: '#334155' },
  filterButtonText: { color: '#f8fafc', fontSize: 12, fontWeight: 'bold' },
  resetButton: { alignSelf: 'center', marginBottom: 6, paddingVertical: 4, paddingHorizontal: 12 },
  resetButtonText: { color: '#ef4444', fontSize: 12, fontWeight: 'bold' },
  counterText: { color: '#64748b', fontSize: 12, textAlign: 'center', marginBottom: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 10, fontSize: 14 },
  listContent: { paddingBottom: 24 },
  row: { justifyContent: 'space-between', gap: 10, marginBottom: 12 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 18,
    width: '90%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f59e0b', marginBottom: 12, textAlign: 'center' },
  modalOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#334155', alignItems: 'center' },
  modalOptionText: { color: '#f8fafc', fontSize: 14, fontWeight: '500' },
  modalCloseButton: { marginTop: 12, paddingVertical: 10, backgroundColor: '#0f172a', borderRadius: 8, alignItems: 'center' },
  modalCloseText: { color: '#94a3b8', fontWeight: 'bold' },
});