import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const login = async () => {
    const res = await API.post("/users/login", data);
    localStorage.setItem("token", res.data.access_token);
    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="username"
        onChange={(e) => setData({ ...data, username: e.target.value })}/>
      <input type="password" placeholder="password"
        onChange={(e) => setData({ ...data, password: e.target.value })}/>
      <button onClick={login}>Login</button>
    </div>
  );
}
