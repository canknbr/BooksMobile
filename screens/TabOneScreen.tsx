import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import { Text, View } from '../components/Themed';
import React, { useState } from 'react';
import { useQuery, gql, useLazyQuery } from '@apollo/client';
import BookItem from '../components/BookItem';
const query = gql`
  query SearchBooks($q: String) {
    googleBooksSearch(q: $q, country: "US") {
      items {
        id
        volumeInfo {
          authors
          averageRating
          description
          imageLinks {
            thumbnail
          }
          title
          subtitle
          industryIdentifiers {
            identifier
            type
          }
        }
      }
    }
    openLibrarySearch(q: $q) {
      docs {
        author_name
        title
        cover_edition_key
        isbn
      }
    }
  }
`;

export default function TabOneScreen() {
  const [search, setSearch] = useState('');
  const [runQuery, { data, loading, error }] = useLazyQuery(query);
  return (
    <View style={styles.container}>
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
      {loading && <ActivityIndicator />}
      {error && (
        <View style={styles.container}>
          <Text style={styles.title}>Error fetching books</Text>
          <Text>{error.message}</Text>
        </View>
      )}
      <FlatList
        data={data?.googleBooksSearch?.items || []}
        renderItem={({ item }) => (
          <BookItem
            book={{
              title: item.volumeInfo.title,
              image: item.volumeInfo.imageLinks.thumbnail,
              authors: item.volumeInfo.authors,
              isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
