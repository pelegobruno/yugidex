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
} from 'react-native';
import CardItem from '../components/CardItem';

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAttribute, setSelectedAttribute] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Estados dos Modais de Seleção
  const [modalTypeVisible, setModalTypeVisible] = useState(false);
  const [modalAttrVisible, setModalAttrVisible] = useState(false);
  const [modalLevelVisible, setModalLevelVisible] = useState(false);

  // Quantidade de colunas responsiva
  const numColumns = width < 500 ? 2 : width < 768 ? 3 : width < 1024 ? 4 : 6;

  useEffect(() => {
    fetchCards();
  }, []);

  // Recalcula a lista filtrada sempre que a busca ou um filtro mudar
  useEffect(() => {
    applyFilters(searchQuery, selectedType, selectedAttribute, selectedLevel);
  }, [searchQuery, selectedType, selectedAttribute, selectedLevel, cards]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://db.ygoprodeck.com/api/v7/cardinfo.php?num=150&offset=0'
      );
      const data = await response.json();
      if (data && data.data) {
        setCards(data.data);
        setFilteredCards(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar cartas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lógica unificada de filtragem
  const applyFilters = (query, type, attribute, level) => {
    let result = cards;

    // 1. Filtro por nome ou ID
    if (query.trim() !== '') {
      result = result.filter(
        (card) =>
          card.name.toLowerCase().includes(query.toLowerCase()) ||
          card.id.toString().includes(query)
      );
    }

    // 2. Filtro por Tipo (Monster, Spell, Trap)
    if (type !== 'all') {
      result = result.filter((card) =>
        card.type?.toLowerCase().includes(type.toLowerCase())
      );
    }

    // 3. Filtro por Atributo (DARK, LIGHT, WATER, etc)
    if (attribute !== 'all') {
      result = result.filter(
        (card) => card.attribute?.toUpperCase() === attribute.toUpperCase()
      );
    }

    // 4. Filtro por Estrelas / Nível
    if (level !== 'all') {
      result = result.filter((card) => card.level === parseInt(level));
    }

    setFilteredCards(result);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedAttribute('all');
    setSelectedLevel('all');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Título do App */}
        <Text style={styles.title}>YuG!Dek</Text>

        {/* Input de Busca */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Procurar por nome ou ID"
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Botões de Filtro */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, selectedType !== 'all' && styles.filterButtonActive]}
            onPress={() => setModalTypeVisible(true)}
          >
            <Text style={styles.filterButtonText}>
              🐍 {selectedType === 'all' ? 'Tipos' : selectedType}
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
        </View>

        {/* Botão de Reset (Se houver algum filtro ativo) */}
        {(selectedType !== 'all' || selectedAttribute !== 'all' || selectedLevel !== 'all' || searchQuery !== '') && (
          <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.resetButtonText}>Limpar Filtros ✕</Text>
          </TouchableOpacity>
        )}

        {/* Contador de Cartas Exibidas */}
        <Text style={styles.counterText}>
          Exibindo {filteredCards.length} de {cards.length} cartas liberadas
        </Text>

        {/* Lista de Cartas ou Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f59e0b" />
            <Text style={styles.loadingText}>Carregando baralho...</Text>
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

        {/* Modal: Selecionar Tipo */}
        <Modal visible={modalTypeVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filtrar por Tipo</Text>
              {['all', 'Monster', 'Spell', 'Trap'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedType(type);
                    setModalTypeVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>
                    {type === 'all' ? 'Todos os Tipos' : type}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalTypeVisible(false)}
              >
                <Text style={styles.modalCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal: Selecionar Atributo */}
        <Modal visible={modalAttrVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filtrar por Atributo</Text>
              <ScrollView style={{ maxHeight: 250 }}>
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

        {/* Modal: Selecionar Nível / Estrelas */}
        <Modal visible={modalLevelVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filtrar por Nível (Estrelas)</Text>
              <ScrollView style={{ maxHeight: 250 }}>
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
  title: { fontSize: 28, fontWeight: 'bold', color: '#f59e0b', textAlign: 'center', marginBottom: 16 },
  searchContainer: { marginBottom: 12 },
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
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, gap: 8 },
  filterButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  filterButtonActive: { borderColor: '#f59e0b', backgroundColor: '#334155' },
  filterButtonText: { color: '#f8fafc', fontSize: 12, fontWeight: 'bold' },
  resetButton: { alignSelf: 'center', marginBottom: 8, paddingVertical: 4, paddingHorizontal: 12 },
  resetButtonText: { color: '#ef4444', fontSize: 12, fontWeight: 'bold' },
  counterText: { color: '#64748b', fontSize: 12, textAlign: 'center', marginBottom: 12 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 8, fontSize: 14 },
  listContent: { paddingBottom: 24 },
  row: { justifyContent: 'space-between', gap: 10, marginBottom: 12 },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f59e0b', marginBottom: 14, textAlign: 'center' },
  modalOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#334155', alignItems: 'center' },
  modalOptionText: { color: '#f8fafc', fontSize: 15, fontWeight: '500' },
  modalCloseButton: { marginTop: 14, paddingVertical: 10, backgroundColor: '#0f172a', borderRadius: 8, alignItems: 'center' },
  modalCloseText: { color: '#94a3b8', fontWeight: 'bold' },
});