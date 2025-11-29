
export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available: number;
};

export const initialBooks: Book[] = [
  { id: "bk-001", title: "Things Fall Apart", author: "Chinua Achebe", isbn: "978-0385474542", copies: 15, available: 12 },
  { id: "bk-002", title: "Half of a Yellow Sun", author: "Chimamanda Ngozi Adichie", isbn: "978-1400044160", copies: 10, available: 8 },
  { id: "bk-003", title: "New General Mathematics for SS1", author: "M.F. Macrae et al.", isbn: "978-0582536336", copies: 25, available: 15 },
  { id: "bk-004", title: "The Joys of Motherhood", author: "Buchi Emecheta", isbn: "978-0807609143", copies: 8, available: 3 },
  { id: "bk-005", title: "A Man of the People", author: "Chinua Achebe", isbn: "978-0385086165", copies: 12, available: 12 },
];
