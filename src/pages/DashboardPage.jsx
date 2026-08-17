import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  callInterviewNow,
  createInterview,
  deleteInterview,
  fetchState,
  getBackendOrigin,
  logout,
  runScheduler,
  updateInterview,
  uploadInterviews
} from "../lib/api";
import { firstName } from "../lib/time";
import StatCard from "../components/StatCard";
import InterviewTable from "../components/InterviewTable";
import { ManualInterviewForm, UploadForm } from "../components/InterviewForms";

const tabs = [
  { id: "upcoming", label: "Upcoming" },
  { id: "needs_attention", label: "Needs Attention" },
  { id: "completed", label: "Completed" }
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  async function loadState() {
    setBusy(true);
    setError("");
    try {
      const payload = await fetchState();
      setState(payload);
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
        return;
      }
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadState();
  }, []);

  const filteredRows = useMemo(() => {
    const items = state?.interviews || [];
    if (activeTab === "needs_attention") {
      return items.filter((item) => ["not_joining", "reschedule_requested", "not_interested", "no_response", "unclear_response", "failed"].includes(String(item.status || "").toLowerCase()));
    }
    if (activeTab === "completed") {
      return items.filter((item) => ["joining_confirmed", "recruiter_completed", "completed"].includes(String(item.status || "").toLowerCase()));
    }
    return items.filter((item) => ["pending", "scheduled", "queued", "calling"].includes(String(item.status || "").toLowerCase()));
  }, [state, activeTab]);

  async function perform(action, successMessage) {
    setMessage("");
    setError("");
    try {
      await action();
      if (successMessage) setMessage(successMessage);
      await loadState();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
    await perform(() => uploadInterviews(formData), "Interview file uploaded.");
  }

  if (busy) {
    return <main className="dashboard-loading">Loading dashboard...</main>;
  }

  return (
    <main className="dashboard-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Separated Frontend Service</p>
          <h1>Hello {firstName(state?.current_user?.name)}</h1>
          <p className="muted-copy">Connected to backend: {getBackendOrigin()}</p>
        </div>
        <div className="top-actions">
          <button className="secondary-button" onClick={() => perform(() => runScheduler(), "Scheduler run started.")}>
            Run scheduler
          </button>
          <button className="ghost-button" onClick={() => perform(() => logout().then(() => navigate("/login")), "")}>
            Log out
          </button>
        </div>
      </header>

      {message ? <div className="success-banner">{message}</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}

      <section className="stats-grid">
        <StatCard label="Total follow ups" value={state?.metrics?.total || 0} />
        <StatCard label="Awaiting reply" value={state?.metrics?.awaiting_reply || 0} tone="amber" />
        <StatCard label="Needs attention" value={state?.metrics?.needs_attention || 0} tone="red" />
        <StatCard label="Completed" value={state?.metrics?.completed || 0} tone="green" />
      </section>

      <section className="forms-grid">
        <ManualInterviewForm onSubmit={(payload) => perform(() => createInterview(payload), "Follow up created.")} />
        <UploadForm onSubmit={handleUpload} />
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h3>Follow up pipeline</h3>
          <div className="tab-row">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={tab.id === activeTab ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <InterviewTable
          items={filteredRows}
          onCallNow={(id) => perform(() => callInterviewNow(id), "Call launched.")}
          onDelete={(id) => perform(() => deleteInterview(id), "Follow up deleted.")}
          onMarkComplete={(id) => perform(() => updateInterview(id, { status: "recruiter_completed" }), "Marked completed.")}
        />
      </section>
    </main>
  );
}
