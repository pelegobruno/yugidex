import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';

export default function DetailScreen({ route, navigation }) {
  const { card } = route.params;
  const imageUrl = card.card_images?.[0]?.image_url;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f172a', padding: 24 }}>
      {/* Botão de Voltar */}
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        style={{
          backgroundColor: '#1e293b',
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 8,
          alignSelf: 'flex-start',
          borderWidth: 1,
          borderColor: '#334155',
          marginBottom: 24,
          cursor: 'pointer'
        }}
      >
        <Text style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: 14 }}>
          ← Voltar à Lista
        </Text>
      </TouchableOpacity>

      {/* Cartão Centralizador */}
      <View 
        style={{
          maxWidth: 900,
          width: '100%',
          alignSelf: 'center',
          backgroundColor: '#1e293b',
          borderRadius: 16,
          padding: 24,
          borderWidth: 1,
          borderColor: '#334155',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 24,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowRadius: 10
        }}
      >
        {/* Coluna da Imagem */}
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {imageUrl && (
            <Image 
              source={{ uri: imageUrl }} 
              style={{ width: 300, height: 440, borderRadius: 8 }}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Coluna das Informações */}
        <View style={{ flex: 1, minWidth: 280 }}>
          {/* Nome da Carta */}
          <Text style={{ color: '#f8fafc', fontSize: 26, fontWeight: 'bold', marginBottom: 4 }}>
            {card.name}
          </Text>

          {/* Tipo e Raça */}
          <Text style={{ color: '#f59e0b', fontSize: 14, fontWeight: '600', marginBottom: 16, textTransform: 'uppercase' }}>
            {card.type} • {card.race}
          </Text>

          {/* Atributos: ATK, DEF e Nível */}
          {(card.atk !== undefined || card.def !== undefined) && (
            <View 
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: '#0f172a',
                padding: 14,
                borderRadius: 10,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: '#334155'
              }}
            >
              <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 14 }}>
                ATK / {card.atk ?? '0'}
              </Text>
              <Text style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: 14 }}>
                DEF / {card.def ?? '0'}
              </Text>
              {card.level && (
                <Text style={{ color: '#eab308', fontWeight: 'bold', fontSize: 14 }}>
                  ★ {card.level}
                </Text>
              )}
            </View>
          )}

          {/* Caixa de Descrição do Efeito */}
          <View 
            style={{
              backgroundColor: '#0f172a',
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#334155'
            }}
          >
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' }}>
              Descrição / Efeito:
            </Text>
            <Text style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 22 }}>
              {card.desc}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}