import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function CardItem({ card, onPress }) {
  const imageUrl = card.card_images?.[0]?.image_url_small;

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        backgroundColor: '#1e293b',
        borderRadius: 10,
        padding: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4
      }}
    >
      {imageUrl ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={{ width: '100%', height: 160, borderRadius: 4 }}
          resizeMode="contain"
        />
      ) : (
        <View style={{ width: '100%', height: 160, backgroundColor: '#334155', borderRadius: 4 }} />
      )}

      <Text 
        style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: 11, marginTop: 6, textAlign: 'center' }} 
        numberOfLines={1}
      >
        {card.name}
      </Text>
    </TouchableOpacity>
  );
}