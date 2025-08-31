import { useEffect, useState } from "react";
import {
  createPost,
  getPosts,
  login,
  register,
  setToken,
} from "./api";
import LoginForm from "./components/LoginForm";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import RegisterForm from "./components/RegisterForm";

function App() {
  const [jwt, setJwt] = useState(localStorage.getItem("jwt"));
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ loading state

  const showMessage = (msg, type = "success") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRegister = async (name, email, password) => {
    try {
      await register(name, email, password);
      showMessage("✅ User registered! Now login.");
    } catch (err) {
      showMessage(err.response?.data?.error || "❌ Registration failed", "error");
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await login(email, password);
      setJwt(res.data.token);
      setToken(res.data.token);
      setUserId(1);
      showMessage("✅ Logged in successfully");
      fetchPosts();
    } catch (err) {
      showMessage(err.response?.data?.error || "❌ Login failed", "error");
    }
  };

  const handleLogout = () => {
    setJwt(null);
    localStorage.removeItem("jwt");
    setPosts([]);
    setUserId(null);
    showMessage("👋 Logged out");
  };

  const fetchPosts = async () => {
    try {
      setLoading(true); // ✅ start loading
      const res = await getPosts();
      setPosts(res.data);
    } catch (err) {
      showMessage("❌ Failed to load posts", "error");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  const handleCreatePost = async (title, content) => {
    try {
      await createPost(title, content, userId);
      fetchPosts();
      showMessage("✅ Post created");
    } catch (err) {
      showMessage(err.response?.data?.error || "❌ Failed to create post", "error");
    }
  };

  useEffect(() => {
    if (jwt) fetchPosts();
  }, [jwt]);

  return (
    <div className="p-6 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">EnergeX Test</h1>

      {message && (
        <div
          className={`p-2 mb-4 rounded ${
            message.type === "error"
              ? "bg-red-200 text-red-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {!jwt ? (
        <div className="space-y-6">
          <RegisterForm onRegister={handleRegister} />
          <LoginForm onLogin={handleLogin} />
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={handleLogout}
            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
          >
            🚪 Logout
          </button>

          {/* ✅ Show spinner while fetching */}
          {loading ? (
            <div className="text-center text-gray-500">⏳ Loading posts...</div>
          ) : (
            <>
              <PostForm onCreatePost={handleCreatePost} />
              <PostList posts={posts} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
