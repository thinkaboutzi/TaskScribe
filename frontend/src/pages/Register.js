import { useState } from "react";
import API from "../api";

export default function Register() {
  const [data, setData] = useState({ username: "", password: "" });

  const register = async () => {
    await API.post("/users/register", data);
    alert("Registered!");
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="username"
        onChange={(e) => setData({ ...data, username: e.target.value })}/>
      <input type="password" placeholder="password"
        onChange={(e) => setData({ ...data, password: e.target.value })}/>
      <button onClick={register}>Register</button>
    </div>
  );
}
