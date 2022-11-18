import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
const API_KEY =
  'itaperucu::stepzen.net+1000::d4e42159c8880dd79fcdb6fb18b622b8efcd8f6dc01cf3614a817ea97c280fd3';
const client = new ApolloClient({
  uri: 'https://itaperucu.stepzen.net/api/billowing-alligator/__graphql',
  headers: {
    Authorization: `Apikey ${API_KEY}`,
  },
  cache: new InMemoryCache(),
});
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </ApolloProvider>
    );
  }
}
