function Book({book}) {
  function authorName(author) {
    const authorValues = [
      author?.title,
      author?.first_name,
      author?.middle_name,
      author?.last_name
    ]

    return authorValues.join(" ");
  }

  return (
    <tr>
      <td>{book.title}</td>
      <td>{authorName(book.author)}</td>
    </tr>
  );
}

export default Book;