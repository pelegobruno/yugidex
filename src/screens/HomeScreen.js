import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { fetchAllCards } from '../api/yugiohApi';
import CardItem from '../components/CardItem';

// Lista de Raças / Tipos
const CARD_RACES = [
  { label: 'Tipos', value: 'all' },
  { label: 'Spellcaster (Mago)', value: 'Spellcaster' },
  { label: 'Dragon (Dragão)', value: 'Dragon' },
  { label: 'Warrior (Guerreiro)', value: 'Warrior' },
  { label: 'Machine (Máquina)', value: 'Machine' },
  { label: 'Fiend (Demónio)', value: 'Fiend' },
  { label: 'Zombie (Zumbi)', value: 'Zombie' },
  { label: 'Insect (Inseto)', value: 'Insect' },
  { label: 'Fairy (Fada)', value: 'Fairy' },
  { label: 'Fish (Peixe)', value: 'Fish' },
  { label: 'Sea Serpent (Serpente Marinha)', value: 'Sea Serpent' },
  { label: 'Dinosaur (Dinossauro)', value: 'Dinosaur' },
  { label: 'Reptile (Réptil)', value: 'Reptile' },
  { label: 'Rock (Rocha)', value: 'Rock' },
  { label: 'Aqua (Água)', value: 'Aqua' },
  { label: 'Pyro (Fogo/Piro)', value: 'Pyro' },
  { label: 'Plant (Planta)', value: 'Plant' },
  { label: 'Beast (Besta)', value: 'Beast' },
  { label: 'Beast-Warrior (Besta-Guerreira)', value: 'Beast-Warrior' },
  { label: 'Winged Beast (Besta Alada)', value: 'Winged Beast' },
  { label: 'Thunder (Trovão)', value: 'Thunder' },
  { label: 'Divine-Beast (Besta Divina)', value: 'Divine-Beast' },
  { label: 'Cyberse (Ciberse)', value: 'Cyberse' },
  { label: 'Wyrm (Wyrm)', value: 'Wyrm' },
];

// Lista de Atributos
const CARD_ATTRIBUTES = [
  { label: 'Atributos', value: 'all' },
  { label: 'DARK (Trevas)', value: 'DARK' },
  { label: 'LIGHT (Luz)', value: 'LIGHT' },
  { label: 'WATER (Água)', value: 'WATER' },
  { label: 'FIRE (Fogo)', value: 'FIRE' },
  { label: 'EARTH (Terra)', value: 'EARTH' },
  { label: 'WIND (Vento)', value: 'WIND' },
  { label: 'DIVINE (Divino)', value: 'DIVINE' },
];

// Níveis / Estrelas (1 a 13)
const CARD_LEVELS = [
  { label: 'Todas as Estrelas', value: 'all' },
  ...Array.from({ length: 13 }, (_, i) => ({ label: `⭐ ${i + 1}`, value: i + 1 }))
];

export default function HomeScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  
  const [selectedRace, setSelectedRace] = useState('all');
  const [selectedAttribute, setSelectedAttribute] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCards() {
      const data = await fetchAllCards();
      if (Array.isArray(data)) {
        const sortedData = [...data].sort((a, b) => a.id - b.id);
        setCards(sortedData);
      }
      setLoading(false);
    }
    loadCards();
  }, []);

  // Filtragem Dinâmica em Tempo Real
  const filteredCards = useMemo(() => {
    return cards.filter(c => {
      if (selectedRace !== 'all' && c.race !== selectedRace) {
        return false;
      }
      if (selectedAttribute !== 'all' && c.attribute !== selectedAttribute) {
        return false;
      }
      if (selectedLevel !== 'all' && c.level !== selectedLevel) {
        return false;
      }
      if (!search.trim()) return true;

      const query = search.toLowerCase().trim();
      const idMatch = c.id && c.id.toString().includes(query);
      const nameMatch = c.name && c.name.toLowerCase().includes(query);

      return idMatch || nameMatch;
    });
  }, [cards, selectedRace, selectedAttribute, selectedLevel, search]);

  const raceLabel = CARD_RACES.find(r => r.value === selectedRace)?.label || 'Raça';
  const attributeLabel = CARD_ATTRIBUTES.find(a => a.value === selectedAttribute)?.label || 'Atributo';
  const levelLabel = selectedLevel === 'all' ? 'Estrelas' : `⭐ ${selectedLevel}`;

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a', padding: 20 }}>
      {/* Título da Aplicação */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ color: '#f59e0b', fontSize: 28, fontWeight: 'bold' }}>
          YuG!Dek
        </Text>
      </View>

      {/* Pesquisa por Texto ou ID */}
      <View style={{ marginBottom: 15, maxWidth: 600, width: '100%', alignSelf: 'center' }}>
        <TextInput
          placeholder=" Procurar por nome ou ID "
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={setSearch}
          style={{
            backgroundColor: '#1e293b',
            color: '#fff',
            padding: 12,
            borderRadius: 8,
            borderColor: '#334155',
            borderWidth: 1,
            outline: 'none'
          }}
        />
      </View>

      {/* Controles de Filtro */}
      <View 
        style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 10,
          marginBottom: 15,
          maxWidth: 600,
          width: '100%',
          alignSelf: 'center'
        }}
      >
        {/* Botão Raça */}
        <TouchableOpacity
          onPress={() => setActiveModal('race')}
          style={{
            flex: 1,
            backgroundColor: selectedRace !== 'all' ? '#f59e0b' : '#1e293b',
            paddingVertical: 10,
            paddingHorizontal: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#334155',
            alignItems: 'center'
          }}
        >
          <Text style={{ color: selectedRace !== 'all' ? '#0f172a' : '#fff', fontWeight: 'bold', fontSize: 13 }} numberOfLines={1}>
            {`🐉 ${raceLabel}`}
          </Text>
        </TouchableOpacity>

        {/* Botão Atributo */}
        <TouchableOpacity
          onPress={() => setActiveModal('attribute')}
          style={{
            flex: 1,
            backgroundColor: selectedAttribute !== 'all' ? '#f59e0b' : '#1e293b',
            paddingVertical: 10,
            paddingHorizontal: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#334155',
            alignItems: 'center'
          }}
        >
          <Text style={{ color: selectedAttribute !== 'all' ? '#0f172a' : '#fff', fontWeight: 'bold', fontSize: 13 }} numberOfLines={1}>
            {`🔮 ${attributeLabel}`}
          </Text>
        </TouchableOpacity>

        {/* Botão Estrelas */}
        <TouchableOpacity
          onPress={() => setActiveModal('level')}
          style={{
            flex: 1,
            backgroundColor: selectedLevel !== 'all' ? '#f59e0b' : '#1e293b',
            paddingVertical: 10,
            paddingHorizontal: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#334155',
            alignItems: 'center'
          }}
        >
          <Text style={{ color: selectedLevel !== 'all' ? '#0f172a' : '#fff', fontWeight: 'bold', fontSize: 13 }} numberOfLines={1}>
            {`⭐ ${levelLabel}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contador Global */}
      <Text style={{ color: '#64748b', fontSize: 12, textAlign: 'center', marginBottom: 15 }}>
        {`Exibindo ${filteredCards.length} de ${cards.length} cartas liberadas`}
      </Text>

      {/* Grelha de Exibição */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text style={{ color: '#f59e0b', marginTop: 12, fontSize: 14 }}>
            A carregar catálogo completo de cartas...
          </Text>
        </View>
      ) : (
        <FlatList
          key="grid-cards-flatlist"
          data={filteredCards}
          keyExtractor={(item) => item.id.toString()}
          numColumns={6}
          initialNumToRender={30}
          maxToRenderPerBatch={30}
          windowSize={11}
          removeClippedSubviews={false}
          columnWrapperStyle={{ justifyContent: 'flex-start' }}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={{ flex: 1, maxWidth: '16.66%', padding: 4 }}>
              <CardItem 
                card={item} 
                onPress={() => navigation.navigate('Detail', { card: item })} 
              />
            </View>
          )}
        />
      )}

      {/* Modal para Seleção de Filtros */}
      <Modal
        visible={activeModal !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View style={{ backgroundColor: '#1e293b', borderRadius: 12, width: '85%', maxWidth: 400, maxHeight: '70%', padding: 16 }}>
            <Text style={{ color: '#f59e0b', fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
              {activeModal === 'race' ? 'Selecionar Raça / Tipo' : activeModal === 'attribute' ? 'Selecionar Atributo' : 'Selecionar Estrelas'}
            </Text>

            <ScrollView style={{ width: '100%' }}>
              {activeModal === 'race' && CARD_RACES.map(item => (
                <TouchableOpacity
                  key={`race-${item.value}`}
                  onPress={() => { setSelectedRace(item.value); setActiveModal(null); }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#334155',
                    backgroundColor: selectedRace === item.value ? '#334155' : 'transparent',
                    paddingHorizontal: 8,
                    borderRadius: 4
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 15 }}>{item.label}</Text>
                </TouchableOpacity>
              ))}

              {activeModal === 'attribute' && CARD_ATTRIBUTES.map(item => (
                <TouchableOpacity
                  key={`attr-${item.value}`}
                  onPress={() => { setSelectedAttribute(item.value); setActiveModal(null); }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#334155',
                    backgroundColor: selectedAttribute === item.value ? '#334155' : 'transparent',
                    paddingHorizontal: 8,
                    borderRadius: 4
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 15 }}>{item.label}</Text>
                </TouchableOpacity>
              ))}

              {activeModal === 'level' && CARD_LEVELS.map(item => (
                <TouchableOpacity
                  key={`level-${item.value}`}
                  onPress={() => { setSelectedLevel(item.value); setActiveModal(null); }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#334155',
                    backgroundColor: selectedLevel === item.value ? '#334155' : 'transparent',
                    paddingHorizontal: 8,
                    borderRadius: 4
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 15 }}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}