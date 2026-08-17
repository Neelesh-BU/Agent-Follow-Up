import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Curatal Scheduler Follow Up</p>
        <h1>Scheduler login</h1>
        <p className="auth-copy">Frontend and backend now run as separate services while keeping the same login flow.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>
          {error ? <div className="error-box">{error}</div> : null}
          <button type="submit" className="primary-button" disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <Link className="text-link" to="/forgot-password">Forgot password?</Link>
      </section>
    </main>
  );
}
