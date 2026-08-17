import { formatDateTime } from "../lib/time";

function businessStatusLabel(item) {
  return item.business_status || item.status || "pending";
}

export default function InterviewTable({ items, onCallNow, onDelete, onMarkComplete }) {
  if (!items.length) {
    return <div className="empty-state">No follow ups in this view yet.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="interview-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Company</th>
            <th>Interview</th>
            <th>Status</th>
            <th>Response</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="cell-title">{item.candidate_name}</div>
                <div className="cell-sub">{item.phone}</div>
              </td>
              <td>
                <div className="cell-title">{item.interview_company || "--"}</div>
                <div className="cell-sub">{item.role || "--"}</div>
              </td>
              <td>
                <div className="cell-title">{formatDateTime(item.interview_time)}</div>
                <div className="cell-sub">Call at {formatDateTime(item.call_scheduled_at)}</div>
              </td>
              <td>
                <span className={`status-pill status-${String(item.status || "").toLowerCase()}`}>
                  {businessStatusLabel(item)}
                </span>
              </td>
              <td>{item.response || "--"}</td>
              <td>{item.reason || item.reschedule_requested_text || "--"}</td>
              <td>
                <div className="action-row">
                  <button className="mini-button" onClick={() => onCallNow(item.id)}>Call now</button>
                  <button className="mini-button" onClick={() => onMarkComplete(item.id)}>Complete</button>
                  <button className="mini-button danger" onClick={() => onDelete(item.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
