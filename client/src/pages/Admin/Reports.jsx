import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../assets/styles.css";

// ---- Mock data (swap for API data once Express/Mongo is connected) ----
const PROJECTS = [
  "All Divisions",
  "SOC Playbook Automation",
  "Phishing Simulation Suite",
  "Network Hardening Audit",
  "SIEM Dashboard Revamp",
];

const MOCK_REPORTS = [
  { id: 1, name: "Weekly Progress Report", project: "All Divisions", format: "PDF", date: "07 Jul 2026" },
  { id: 2, name: "Task Completion Summary", project: "SOC Playbook Automation", format: "Excel", date: "02 Jul 2026" },
  { id: 3, name: "Overdue Tasks Report", project: "Network Hardening Audit", format: "PDF", date: "28 Jun 2026" },
];

export default function Reports() {
  const [project, setProject] = useState(PROJECTS[0]);
  const [format, setFormat] = useState("PDF");
  const [reports, setReports] = useState(MOCK_REPORTS);

  const handleGenerate = () => {
    const newReport = {
      id: reports.length + 1,
      name: `${project} Report`,
      project,
      format,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    setReports((prev) => [newReport, ...prev]);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="reports-page">
          <div className="reports-header">
            <h1>Reports</h1>
            <p className="subtext">Generate and download progress reports</p>
          </div>

          {/* Generate card */}
          <div className="generate-card">
            <div className="generate-field">
              <label>Project</label>
              <select value={project} onChange={(e) => setProject(e.target.value)}>
                {PROJECTS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="generate-field">
              <label>Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
              </select>
            </div>

            <button className="btn-primary" onClick={handleGenerate}>
              Generate Report
            </button>
          </div>

          {/* Report list */}
          <div className="reports-table-card">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Project</th>
                  <th>Format</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td className="report-name">{r.name}</td>
                    <td>{r.project}</td>
                    <td>
                      <span className={`format-badge format-${r.format.toLowerCase()}`}>
                        {r.format}
                      </span>
                    </td>
                    <td>{r.date}</td>
                    <td className="download-cell">
                      <button className="btn-link">Download</button>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-row">No reports generated yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
