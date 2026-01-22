function Author({ author }) {
  return (
    <tr>
      <td>{author.title}</td>
      <td>{author.first_name}</td>
      <td>{author.middle_name}</td>
      <td>{author.last_name}</td>
    </tr>
  );
}

export default Author;