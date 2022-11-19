import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import { Text, View } from '../../components/Themed';
import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import BookItem from '../../components/BookItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { query } from '../SearchScreen/queries';

export default function SearchScrenn() {
  const [search, setSearch] = useState('');
  const [provider, setProvider] = useState<
    'googleBooksSearch' | 'openLibrarySearch'
  >('googleBooksSearch');
  const [runQuery, { data, loading, error }] = useLazyQuery(query);
  const parseBook = (item: any): Book => {
    if (provider === 'googleBooksSearch') {
      return {
        title: item.volumeInfo?.title,
        image: item.volumeInfo.imageLinks.thumbnail,
        authors: item.volumeInfo.authors,
        isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
      };
    }
    return {
      image: `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`,
      title: item.title,
      authors: item.author_name,
      isbn: item.isbn?.[0],
    };
  };
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
        />
        <Button
          title="Search"
          onPress={() => runQuery({ variables: { q: search } })}
        />
      </View>
      <View style={styles.tabs}>
        <Text
          style={
            provider === 'googleBooksSearch'
              ? { fontWeight: 'bold', color: 'royalblue' }
              : {}
          }
          onPress={() => setProvider('googleBooksSearch')}
        >
          Google Books
        </Text>
        <Text
          style={
            provider === 'openLibrarySearch'
              ? { fontWeight: 'bold', color: 'royalblue' }
              : {}
          }
          onPress={() => setProvider('openLibrarySearch')}
        >
          Open Library
        </Text>
      </View>
      {loading && <ActivityIndicator />}
      {error && (
        <View style={styles.container}>
          <Text style={styles.title}>Error fetching books</Text>
          <Text>{error.message}</Text>
        </View>
      )}
      <FlatList
        data={
          (provider === 'googleBooksSearch'
            ? data?.googleBooksSearch?.items
            : data?.openLibrarySearch?.docs) || []
        }
        renderItem={({ item }) => <BookItem book={parseBook(item)} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
    alignItems: 'center',
  },
  tab: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gainsboro',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
});
