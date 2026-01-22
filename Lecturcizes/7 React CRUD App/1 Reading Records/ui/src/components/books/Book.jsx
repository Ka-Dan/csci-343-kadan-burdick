function Book({book}) {
  return (
    <tr>
      <td>{book.name}</td>
      <td>{book.author}</td>
    </tr>
  );
}

export default Book;