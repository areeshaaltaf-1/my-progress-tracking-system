import { useState, useEffect } from "react";
import SupervisorSidebar from "../../components/SupervisorSidebar";
import api from "../../api/axios";
import "../../assets/styles.css";

export default function SupervisorReports() {
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [genFormat, setGenFormat] = useState("PDF");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await api.get("/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
      if (res.data.length > 0) setProject(res.data[0]._id);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchProjects();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file first");
      return;
    }
    if (!project) {
      alert("Please select a project");
      return;
    }

    const ext = file.name.split(".").pop().toLowerCase();
    const format = ext === "pdf" ? "PDF" : "Excel";
    const reportTitle = title.trim() || file.name;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("project", project);
    formData.append("title", reportTitle);
    formData.append("format", format);

    setUploading(true);
    try {
      await api.post("/reports/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTitle("");
      setFile(null);
      document.getElementById("report-file-input").value = "";
      fetchReports();
    } catch (err) {
      console.error("Upload failed:", err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!project) {
      alert("Please select a project");
      return;
    }

    setGenerating(true);
    try {
      await api.post("/reports/generate", {
        project,
        format: genFormat,
        title: title.trim() || undefined,
      });
      setTitle("");
      fetchReports();
    } catch (err) {
      console.error("Generate failed:", err);
      alert(err.response?.data?.message || "Generate failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (id, fileName) => {
    api
      .get(`/reports/${id}/download`, { responseType: "blob" })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => console.error("Download failed:", err));
  };

  return (
    <div className="smp-layout">
      <SupervisorSidebar />

      <main className="smp-main reports-page">
        <div className="reports-header">
          <h1>Reports</h1>
          <p className="subtext">Generate or upload reports for your projects</p>
        </div>

        {/* Upload section */}
        <div className="generate-card">
          <div className="generate-field">
            <label>Project</label>
            <select value={project} onChange={(e) => setProject(e.target.value)}>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.projectName}</option>
              ))}
            </select>
          </div>

          <div className="generate-field">
            <label>Title (optional)</label>
            <input
              type="text"
              placeholder="e.g. Progress Report - July"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="generate-field">
            <label>File (PDF or Excel)</label>
            <input
              id="report-file-input"
              type="file"
              accept=".pdf,.xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button className="btn-primary" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Report"}
          </button>
        </div>

        {/* Generate section */}
        <div className="generate-card">
          <div className="generate-field">
            <label>Project</label>
            <select value={project} onChange={(e) => setProject(e.target.value)}>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.projectName}</option>
              ))}
            </select>
          </div>

          <div className="generate-field">
            <label>Format</label>
            <select value={genFormat} onChange={(e) => setGenFormat(e.target.value)}>
              <option value="PDF">PDF</option>
              <option value="Excel">Excel</option>
            </select>
          </div>

          <button className="btn-primary" onClick={handleGenerate} disabled={generating}>
            {generating ? "Generating..." : "Generate Report"}
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
              {loading ? (
                <tr><td colSpan="4" className="empty-row">Loading...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan="4" className="empty-row">No reports yet.</td></tr>
              ) : (
                reports.map((r) => (
                  <tr key={r._id}>
                    <td className="report-name">{r.title}</td>
                    <td>
                      <span className={r.format === "PDF" ? "format-badge format-pdf" : "format-badge format-excel"}>
                        {r.format}
                      </span>
                    </td>
                    <td>{new Date(r.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td className="download-cell">
                      <button className="btn-link" onClick={() => handleDownload(r._id, r.fileName)}>
                        Download
                      </button>
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