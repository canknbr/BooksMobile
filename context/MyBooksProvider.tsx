import { createContext, useContext, ReactNode, useState } from 'react';

type Props = {
  children: ReactNode;
};
type MyBooksContextType = {
  onToggleSave: (book: Book) => void;
  isSavedBook: (book: Book) => boolean;
  savedBooks: Book[];
};
const MyBooksContext = createContext<MyBooksContextType>({
  onToggleSave: () => {},
  isSavedBook: () => false,
  savedBooks: [],
});

const MyBooksProvider = ({ children }: Props) => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);

  const areSameBook = (book1: Book, book2: Book) => {
    return JSON.stringify(book1) === JSON.stringify(book2);
  };
  const isSavedBook = (book: Book) => {
    return savedBooks.some(sBook => areSameBook(sBook, book));
  };
  const onToggleSave = (book: Book) => {
    if (!isSavedBook(book)) {
      setSavedBooks(books => [book, ...books]);
    } else {
      setSavedBooks(books => books.filter(sBook => !areSameBook(sBook, book)));
    }
  };
  return (
    <MyBooksContext.Provider
      value={{
        onToggleSave,
        isSavedBook,
        savedBooks,
      }}
    >
      {children}
    </MyBooksContext.Provider>
  );
};
export const useMyBooks = () => useContext(MyBooksContext);
export { MyBooksContext, MyBooksProvider };
