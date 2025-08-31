export default function PostList({ posts }) {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.id} className="p-2 border-b">
              <strong className="block text-blue-700">{p.title}</strong>
              <p className="text-gray-700">{p.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
