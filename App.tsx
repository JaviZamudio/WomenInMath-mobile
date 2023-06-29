import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import Main from './src/Main';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <SafeAreaView style={{ flex: 1 }}>

          <StatusBar style="auto"  />

          <Main />

        </SafeAreaView>
      </AuthProvider>
    </NavigationContainer>
  );
}