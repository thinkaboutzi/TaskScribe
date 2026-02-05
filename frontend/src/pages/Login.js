import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import useGlassHover from "../hooks/useGlassHover";

export default function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  useGlassHover();

  const login = async () => {
    const res = await API.post("/users/login", data);
    localStorage.setItem("token", res.data.access_token);
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-card glass-card glass-hover">
          <div className="auth-brand">
            <span className="brand-mark" />
            <div>
              <div className="brand-title">TaskScribe</div>
              <div className="brand-subtitle">Turn meetings into momentum</div>
            </div>
          </div>

          <h3 className="auth-heading">Welcome back</h3>
          <p className="auth-subheading">Sign in to manage your tasks.</p>

          <div className="auth-form">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              placeholder="Enter your username"
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />

            <label className="form-label mt-3">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />

            <button className="btn btn-primary w-100 mt-4" onClick={login}>
              Login
            </button>
          </div>

          <p className="auth-footer">
            New user? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
