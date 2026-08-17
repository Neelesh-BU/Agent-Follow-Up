import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmPasswordReset } from "../lib/api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await confirmPasswordReset({
        token: searchParams.get("token") || "",
        password
      });
      setMessage("Password updated successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Password recovery</p>
        <h1>Reset password</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            New password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <label>
            Confirm password
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          </label>
          {message ? <div className="success-box">{message}</div> : null}
          {error ? <div className="error-box">{error}</div> : null}
          <button type="submit" className="primary-button">Update password</button>
        </form>
        <Link className="text-link" to="/login">Back to login</Link>
      </section>
    </main>
  );
}
