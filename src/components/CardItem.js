import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';

export default function CardItem({ card, onPress }) {
  // Retorna a cor da borda com base no tipo da carta de Yu-Gi-Oh!
  const getBorderColor = (type = '') => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('spell')) return '#059669'; // Mágica (Verde)
    if (lowerType.includes('trap')) return '#be185d';  // Armadilha (Rosa)
    if (lowerType.includes('fusion')) return '#7c3aed'; // Fusão (Roxo)
    if (lowerType.includes('effect')) return '#ea580c'; // Monstro de Efeito (Laranja)
    return '#d97706'; // Monstro Normal (Dourado)
  };

  const borderColor = getBorderColor(card?.type);
  const imageUrl = card?.card_images?.[0]?.image_url || card?.card_images?.[0]?.image_url_small;

  return (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.cardContainer, { borderColor }]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <Text style={styles.cardTitle} numberOfLines={1} ellipsisMode="tail">
          {card?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    maxWidth: '100%',
  },
  cardContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 6,
    alignItems: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 0.7, // Garante a proporção retangular original das cartas de Yu-Gi-Oh!
    borderRadius: 4,
    backgroundColor: '#0f172a',
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center',
    width: '100%',
  },
});