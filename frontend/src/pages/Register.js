import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import useGlassHover from "../hooks/useGlassHover";

export default function Register() {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  useGlassHover();

  const register = async () => {
    await API.post("/users/register", data);
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-card glass-card glass-hover">
          <div className="auth-brand">
            <span className="brand-mark" />
            <div>
              <div className="brand-title">TaskScribe</div>
              <div className="brand-subtitle">Start writing tasks in seconds</div>
            </div>
          </div>

          <h3 className="auth-heading">Create your account</h3>
          <p className="auth-subheading">One workspace for every meeting.</p>

          <div className="auth-form">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              placeholder="Choose a username"
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />

            <label className="form-label mt-3">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />

            <button className="btn btn-primary w-100 mt-4" onClick={register}>
              Register
            </button>
          </div>

          <p className="auth-footer">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
