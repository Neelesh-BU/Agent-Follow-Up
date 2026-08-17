import { useState } from "react";

export function ManualInterviewForm({ onSubmit }) {
  const [form, setForm] = useState({
    candidate_name: "",
    phone: "",
    interview_company: "",
    interview_time: "",
    role: "",
    notes: ""
  });

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(form);
    setForm({
      candidate_name: "",
      phone: "",
      interview_company: "",
      interview_time: "",
      role: "",
      notes: ""
    });
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div className="panel-heading">
        <h3>Manual Entry</h3>
        <p>Create a follow up directly from the frontend service.</p>
      </div>
      <label>
        Candidate name
        <input value={form.candidate_name} onChange={(event) => update("candidate_name", event.target.value)} required />
      </label>
      <label>
        Phone
        <input value={form.phone} onChange={(event) => update("phone", event.target.value)} required />
      </label>
      <label>
        Company
        <input value={form.interview_company} onChange={(event) => update("interview_company", event.target.value)} required />
      </label>
      <label>
        Interview time
        <input type="datetime-local" value={form.interview_time} onChange={(event) => update("interview_time", event.target.value)} required />
      </label>
      <label>
        Role
        <input value={form.role} onChange={(event) => update("role", event.target.value)} />
      </label>
      <label className="span-2">
        Notes
        <textarea rows="3" value={form.notes} onChange={(event) => update("notes", event.target.value)} />
      </label>
      <div className="span-2 form-actions">
        <button type="submit" className="primary-button">Create follow up</button>
      </div>
    </form>
  );
}

export function UploadForm({ onSubmit }) {
  const [file, setFile] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) return;
    await onSubmit(file);
    setFile(null);
    event.currentTarget.reset();
  }

  return (
    <form className="panel upload-panel" onSubmit={handleSubmit}>
      <div className="panel-heading">
        <h3>Bulk Upload</h3>
        <p>Upload `.csv` or `.xlsx` using the same backend import pipeline.</p>
      </div>
      <input type="file" accept=".csv,.xlsx" onChange={(event) => setFile(event.target.files?.[0] || null)} required />
      <button type="submit" className="secondary-button">Upload interviews</button>
    </form>
  );
}
