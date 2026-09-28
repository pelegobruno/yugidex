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
} from 'react-native';
import CardItem from '../components/CardItem';

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Define dinamicamente o número de colunas conforme o tamanho da tela
  // Celular: 2 colunas | Tablet: 3-4 colunas | Desktop: 6 colunas
  const numColumns = width < 500 ? 2 : width < 768 ? 3 : width < 1024 ? 4 : 6;

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://db.ygoprodeck.com/api/v7/cardinfo.php?num=100&offset=0'
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

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredCards(cards);
    } else {
      const filtered = cards.filter(
        (card) =>
          card.name.toLowerCase().includes(text.toLowerCase()) ||
          card.id.toString().includes(text)
      );
      setFilteredCards(filtered);
    }
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
            onChangeText={handleSearch}
          />
        </View>

        {/* Botões de Filtro */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>🐍 Tipos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>🧙 Atributos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>⭐ Estrelas</Text>
          </TouchableOpacity>
        </View>

        {/* Contador de Cartas Liberadas */}
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
            key={numColumns} // Chave para forçar re-render quando mudar a orientação/largura
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f59e0b',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 12,
  },
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: 'bold',
  },
  counterText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 8,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    justifyAxisAlignment: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
});