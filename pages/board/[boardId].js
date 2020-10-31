
export default function Board ({ query, initialData }) {
  return <div>TODO List</div>
}

export async function getInitialProps({ query }) {
  const { boardId } = query;
  console.log('boardId: ', boardId);
  return { props: { todos } };
}
