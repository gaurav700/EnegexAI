import axios from "axios";

// Load base API URL from environment
const API_URL = import.meta.env.VITE_API_URL;

let token = localStorage.getItem("jwt") || null;

export const setToken = (jwt) => {
  token = jwt;
  localStorage.setItem("jwt", jwt); // persist across refresh
};

const authHeader = () =>
  token ? { Authorization: `Bearer ${token}` } : {};

// Register user
export const register = (name, email, password) =>
  axios.post(`${API_URL}/register`, { name, email, password });

// Login user
export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  if (res.data.token) setToken(res.data.token);
  return res;
};

// Fetch all posts
export const getPosts = () =>
  axios.get(`${API_URL}/posts`, { headers: authHeader() });

// Create a new post (user_id comes from JWT in backend)
export const createPost = (title, content) =>
  axios.post(
    `${API_URL}/posts`,
    { title, content },
    { headers: authHeader() }
  );
