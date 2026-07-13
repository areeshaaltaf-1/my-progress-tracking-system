import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !password) { setError("Please fill all fields."); return; }
    if (!emailRegex.test(trimmedEmail)) { setError("Please enter a valid email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: trimmedEmail, password,
      });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
      setError("");
      if (user.role.toLowerCase() === "admin") navigate("/admin/dashboard");
      else if (user.role.toLowerCase() === "supervisor") navigate("/supervisor/dashboard");
      else if (user.role.toLowerCase() === "internee") navigate("/intern/tasks");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          display: flex;
          height: 100vh;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          position: relative;
          background: #f8fafc;
        }

        /* ═══════════ LEFT — dark diagonal panel ═══════════ */
        .lp-left {
          position: relative;
          width: 58%;
          background: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          /* diagonal right edge */
          clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
          z-index: 1;
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? 'translateX(0)' : 'translateX(-40px)'};
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }

        /* top-right glow */
        .lp-left::before {
          content: '';
          position: absolute;
          top: -80px; right: 60px;
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 65%);
          pointer-events: none;
        }

        /* bottom-left glow */
        .lp-left::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -40px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%);
          pointer-events: none;
        }

        .lp-brand {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-right: 10%;
          padding-left: 10%;
        }

        /* animated bar chart icon */
        .lp-icon {
          display: flex;
          align-items: flex-end;
          gap: 5px;
          margin-bottom: 2rem;
          height: 42px;
        }

        .lp-bar {
          width: 10px;
          border-radius: 3px 3px 0 0;
          background: #10b981;
          transform-origin: bottom;
          animation: bar-grow 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
        .lp-bar:nth-child(1) { height: 55%; animation-delay: 0.4s; opacity: 0.5; }
        .lp-bar:nth-child(2) { height: 75%; animation-delay: 0.55s; opacity: 0.7; }
        .lp-bar:nth-child(3) { height: 100%; animation-delay: 0.7s; opacity: 1; }
        .lp-bar:nth-child(4) { height: 65%; animation-delay: 0.85s; opacity: 0.65; }

        @keyframes bar-grow {
          from { transform: scaleY(0); opacity: 0; }
          to   { transform: scaleY(1); }
        }

        /* trend line SVG */
        .lp-trend {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.06;
          pointer-events: none;
        }

        .lp-brand h1 {
          font-size: 2.8rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -1px;
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? 'translateY(0)' : 'translateY(20px)'};
          transition: opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s;
        }

        .lp-brand h1 em {
          font-style: normal;
          color: #10b981;
        }

        .lp-tag {
          margin-top: 0.6rem;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: #334155;
          opacity: ${mounted ? 1 : 0};
          transition: opacity 0.7s ease 0.5s;
        }

        .lp-accent-line {
          width: 0;
          height: 2.5px;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 2px;
          margin: 1.2rem 0;
          animation: line-expand 0.6s ease 0.8s forwards;
        }
        @keyframes line-expand {
          to { width: 56px; }
        }

        .lp-desc {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.75;
          max-width: 300px;
          opacity: ${mounted ? 1 : 0};
          transition: opacity 0.7s ease 0.65s;
        }

        /* floating dots decoration */
        .lp-dots-deco {
          position: absolute;
          bottom: 2rem;
          right: 14%;
          display: grid;
          grid-template-columns: repeat(4, 6px);
          gap: 6px;
          opacity: 0.15;
        }
        .lp-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #10b981;
        }

        /* ═══════════ RIGHT — white form panel ═══════════ */
        .lp-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 3rem 2rem 5rem;
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? 'translateX(0)' : 'translateX(30px)'};
          transition: opacity 0.7s ease 0.2s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s;
        }

        .lp-form {
          width: 100%;
          max-width: 360px;
        }

        .lp-form-eyebrow {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #10b981;
          margin-bottom: 0.5rem;
        }

        .lp-form h2 {
          font-size: 1.9rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
          margin-bottom: 0.3rem;
        }

        .lp-form-sub {
          font-size: 0.875rem;
          color: #94a3b8;
          margin-bottom: 2rem;
        }

        /* fields */
        .lp-field { margin-bottom: 1.15rem; }

        .lp-field label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.4rem;
        }

        .lp-wrap { position: relative; }

        .lp-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          font-family: 'Inter', sans-serif;
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .lp-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.13);
          background: #fff;
        }
        .lp-input::placeholder { color: #c9d5e0; }
        .lp-input-pw { padding-right: 2.8rem; }

        .lp-eye {
          position: absolute; right: 0.9rem; top: 50%;
          transform: translateY(-50%);
          cursor: pointer; color: #94a3b8;
          font-size: 1rem; user-select: none; line-height: 1;
          transition: color 0.2s;
        }
        .lp-eye:hover { color: #10b981; }

        .lp-options {
          display: flex; justify-content: space-between; align-items: center;
          margin: 0.3rem 0 1.3rem;
          font-size: 0.82rem;
        }
        .lp-remember {
          display: flex; align-items: center; gap: 0.45rem;
          color: #64748b; cursor: pointer; accent-color: #10b981;
        }
        .lp-forgot {
          color: #10b981; font-weight: 500;
          text-decoration: none; transition: color 0.2s;
        }
        .lp-forgot:hover { color: #059669; text-decoration: underline; }

        /* error */
        .lp-error {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.8rem; color: #dc2626;
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 8px; padding: 0.55rem 0.85rem;
          margin-bottom: 1rem;
          animation: lp-shake 0.4s ease;
        }
        @keyframes lp-shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }

        /* button */
        .lp-btn {
          width: 100%; padding: 0.88rem;
          background: #0f172a; color: #fff;
          font-size: 0.9rem; font-weight: 700;
          font-family: 'Inter', sans-serif; letter-spacing: 0.3px;
          border: none; border-radius: 10px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          position: relative; overflow: hidden;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }

        /* green sweep on hover */
        .lp-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(16,185,129,0.18) 100%);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .lp-btn:hover:not(:disabled)::after { opacity: 1; }
        .lp-btn:hover:not(:disabled) {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15,23,42,0.25);
        }
        .lp-btn:active:not(:disabled) { transform: scale(0.98); box-shadow: none; }
        .lp-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* loading dots */
        .lp-bdots { display: flex; gap: 5px; align-items: center; }
        .lp-bdots span {
          width: 6px; height: 6px; background: #fff;
          border-radius: 50%; animation: lp-bounce 1.1s infinite ease-in-out;
        }
        .lp-bdots span:nth-child(2) { animation-delay: 0.18s; }
        .lp-bdots span:nth-child(3) { animation-delay: 0.36s; }
        @keyframes lp-bounce {
          0%,80%,100% { transform: scale(0.55); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        .lp-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.72rem;
          color: #cbd5e1;
        }
      `}</style>

      <div className="lp-root">

        {/* ══ LEFT ══ */}
        <div className="lp-left">

          {/* big background trend line */}
          <svg className="lp-trend" viewBox="0 0 500 400" preserveAspectRatio="none">
            <polyline
              points="0,300 100,220 200,260 300,140 400,180 500,80"
              fill="none" stroke="#10b981" strokeWidth="2"
            />
          </svg>

          <div className="lp-brand">

            {/* animated bar chart icon */}
            <div className="lp-icon">
              <div className="lp-bar" />
              <div className="lp-bar" />
              <div className="lp-bar" />
              <div className="lp-bar" />
            </div>

            <h1>Progress<br /><em>Tracker</em></h1>
            <p className="lp-tag">Project Management System</p>
            <div className="lp-accent-line" />
            <p className="lp-desc">
              Organize projects, assign tasks, monitor progress,
              and improve team productivity through one centralized platform.
            </p>
          </div>

          {/* dot grid decoration */}
          <div className="lp-dots-deco">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="lp-dot" />
            ))}
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="lp-right">
          <div className="lp-form">

            <p className="lp-form-eyebrow">Welcome back</p>
            <h2>Sign in</h2>
            <p className="lp-form-sub">Enter your credentials to continue</p>

            <div className="lp-field">
              <label>Email address</label>
              <div className="lp-wrap">
                <input
                  className="lp-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            <div className="lp-field">
              <label>Password</label>
              <div className="lp-wrap">
                <input
                  className="lp-input lp-input-pw"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <span className="lp-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            <div className="lp-options">
              <label className="lp-remember">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="lp-forgot">Forgot password?</a>
            </div>

            {error && (
              <div className="lp-error">
                <span>⚠</span> {error}
              </div>
            )}

            <button className="lp-btn" onClick={handleLogin} disabled={isLoading}>
              {isLoading
                ? <span className="lp-bdots"><span /><span /><span /></span>
                : "Sign In →"
              }
            </button>

            <p className="lp-footer">Progress Tracker © 2025 · All rights reserved</p>
          </div>
        </div>

      </div>
    </>
  );
}

export default Login;
