import { useState } from "react";
import SupervisorSidebar from "../../components/SupervisorSidebar";
import "../../assets/styles.css";

const initialReports = [
  { id: 1, name: "SOC Playbook Automation - Progress Report", format: "PDF", date: "10 Jul 2026" },
  { id: 2, name: "Threat Intelligence Dashboard - Sprint Summary", format: "Excel", date: "08 Jul 2026" },
  { id: 3, name: "Team Performance - Q3 Overview", format: "PDF", date: "05 Jul 2026" },
  { id: 4, name: "Vulnerability Management - Risk Report", format: "Excel", date: "01 Jul 2026" },
];

const projects = [
  "SOC Playbook Automation",
  "Threat Intelligence Dashboard",
  "Vulnerability Management Pipeline",
  "Incident Response Drills",
  "Access Control Audit",
  "SIEM Rule Optimisation",
];

export default function SupervisorReports() {
  const [reports, setReports] = useState(initialReports);
  const [project, setProject] = useState(projects[0]);
  const [type, setType] = useState("Progress Report");

  const handleGenerate = () => {
    const newReport = {
      id: Date.now(),
      name: `${project} - ${type}`,
      format: type === "Sprint Summary" ? "Excel" : "PDF",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    setReports([newReport, ...reports]);
  };

  return (
    <div className="smp-layout">
      <SupervisorSidebar />

      <main className="smp-main reports-page">
        <div className="reports-header">
          <h1>Reports</h1>
          <p className="subtext">Generate and download reports for your projects</p>
        </div>

        <div className="generate-card">
          <div className="generate-field">
            <label>Project</label>
            <select value={project} onChange={(e) => setProject(e.target.value)}>
              {projects.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="generate-field">
            <label>Report Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option>Progress Report</option>
              <option>Sprint Summary</option>
              <option>Risk Report</option>
              <option>Task Breakdown</option>
            </select>
          </div>

          <button className="btn-primary" onClick={handleGenerate}>
            Generate Report
          </button>
        </div>

        <div className="reports-table-card">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Format</th>
                <th>Generated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-row">No reports generated yet.</td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id}>
                    <td className="report-name">{r.name}</td>
                    <td>
                      <span
                        className={
                          r.format === "PDF" ? "format-badge format-pdf" : "format-badge format-excel"
                        }
                      >
                        {r.format}
                      </span>
                    </td>
                    <td>{r.date}</td>
                    <td className="download-cell">
                      <button className="btn-link">Download</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}