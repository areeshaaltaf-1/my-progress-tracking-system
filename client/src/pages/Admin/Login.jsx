import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../assets/styles.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !password) {
      setError("Please fill all fields.");
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email: trimmedEmail, password }
      );

      const { token, user } = response.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      setError("");

      // ✅ Redirect based on role
    if (user.role.toLowerCase() === "admin") {
  navigate("/admin/dashboard");
} else if (user.role.toLowerCase() === "supervisor") {
  navigate("/supervisor/dashboard");
} else if (user.role.toLowerCase() === "internee") {
  navigate("/intern/tasks");
} else {
  navigate("/");
}

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="left-panel">
        <div className="brand">
          <h1>Progress Tracker</h1>
          <p className="subtitle">PROJECT MANAGEMENT SYSTEM</p>
          <div className="divider"></div>
          <p className="description">
            Organize projects, assign tasks, monitor progress,
            and improve team productivity through one centralized platform.
          </p>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="login-text">Sign in to continue</p>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </span>
            </div>
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              Remember Me
            </label>
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="login-btn" onClick={handleLogin}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;