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
  const [jwt, setJwt] = useState(localStorage.getItem("jwt")); // ✅ read from localStorage
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);

  const handleRegister = async (name, email, password) => {
    await register(name, email, password);
    alert("✅ User registered! Now login.");
  };

  const handleLogin = async (email, password) => {
    const res = await login(email, password);
    setJwt(res.data.token);
    setToken(res.data.token); 
    setUserId(1); 
    fetchPosts();
  };

  const handleLogout = () => {
    setJwt(null);
    localStorage.removeItem("jwt"); 
    setPosts([]);
    setUserId(null);
  };

  const fetchPosts = async () => {
    const res = await getPosts();
    setPosts(res.data);
  };

  const handleCreatePost = async (title, content) => {
    await createPost(title, content, userId);
    fetchPosts();
  };

  useEffect(() => {
    if (jwt) fetchPosts();
  }, [jwt]);

  return (
    <div>
      <h1>EnergeX Test</h1>
      {!jwt ? (
        <>
          <RegisterForm onRegister={handleRegister} />
          <LoginForm onLogin={handleLogin} />
        </>
      ) : (
        <>
          <button onClick={handleLogout}>🚪 Logout</button>
          <PostForm onCreatePost={handleCreatePost} />
          <PostList posts={posts} />
        </>
      )}
    </div>
  );
}

export default App;
