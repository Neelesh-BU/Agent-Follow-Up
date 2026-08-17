import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const payload = await requestPasswordReset({ email });
      setMessage(payload.message || "If the email is authorized, a reset link has been sent.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Password recovery</p>
        <h1>Forgot password</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          {message ? <div className="success-box">{message}</div> : null}
          {error ? <div className="error-box">{error}</div> : null}
          <button type="submit" className="primary-button">Send reset link</button>
        </form>
        <Link className="text-link" to="/login">Back to login</Link>
      </section>
    </main>
  );
}
