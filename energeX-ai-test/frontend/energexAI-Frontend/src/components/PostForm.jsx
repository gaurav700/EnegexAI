import { useState } from "react";

export default function PostForm({ onCreatePost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCreatePost(title, content);
        setTitle("");
        setContent("");
      }}
      className="p-4 border rounded shadow space-y-3"
    >
      <h2 className="text-lg font-semibold">Create Post</h2>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Add Post
      </button>
    </form>
  );
}
