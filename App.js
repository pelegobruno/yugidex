import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Configura a linguagem da página para PT-BR e ativa o suporte de tradução do navegador
      document.documentElement.lang = 'pt-BR';

      // Trava de viewport apenas para impedir zoom gestual no celular
      let metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport) {
        metaViewport.content =
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      } else {
        metaViewport = document.createElement('meta');
        metaViewport.name = 'viewport';
        metaViewport.content =
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(metaViewport);
      }
    }
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}