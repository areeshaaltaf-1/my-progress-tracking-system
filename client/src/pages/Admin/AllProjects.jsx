import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../assets/styles.css";
import { useState, useEffect } from "react";
import api from "../../api/axios";



function AllProjects() {
  const [allProjects, setAllProjects] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [viewProject, setViewProject] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    supervisor: "",
    priority: "Medium",
    startDate: "",
    endDate: "",
  });

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setAllProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const fetchSupervisors = async () => {
    try {
      const res = await api.get("/users");
      setSupervisors(res.data.filter((u) => u.role === "Supervisor"));
    } catch (err) {
      console.error("Failed to fetch supervisors", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchSupervisors();
  }, []);

  // Filter logic
  const filtered = allProjects.filter((p) => {
    const matchSearch = p.projectName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const today = new Date();

  const totalCount = allProjects.length;
  const completedCount = allProjects.filter((p) => p.status === "Completed").length;
  const overdueCount = allProjects.filter(
    (p) => p.status !== "Completed" && p.endDate && new Date(p.endDate) < today
  ).length;
  const activeCount = allProjects.filter(
    (p) => p.status !== "Completed" && !(p.endDate && new Date(p.endDate) < today)
  ).length;
  const handleCreate = async () => {
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, form);
      } else {
        await api.post("/projects/create", form);
      }
      setShowModal(false);
      setEditingId(null);
      setForm({
        projectName: "",
        description: "",
        supervisor: "",
        priority: "Medium",
        startDate: "",
        endDate: "",
      });
      fetchProjects();
    } catch (err) {
      console.error("Failed to save project", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        {/* Header */}
        <div className="ap-header">
          <div>
            <h1 className="ap-title">All Projects</h1>
            <p className="ap-sub">Manage and monitor every division project</p>
          </div>
          <button
            className="btn-new"
            onClick={() => {
              setEditingId(null);
              setForm({
                projectName: "",
                description: "",
                supervisor: "",
                priority: "Medium",
                startDate: "",
                endDate: "",
              });
              setShowModal(true);
            }}
          >
            + New Project
          </button>
        </div>

        {/* Stats Row */}
        <div className="ap-stats">
          <div className="ap-stat-card" style={{ borderLeftColor: "#14b8a6" }}>
            <div className="ap-stat-num" style={{ color: "#14b8a6" }}>{totalCount}</div>
            <div className="ap-stat-label">Total Projects</div>
          </div>
          <div className="ap-stat-card" style={{ borderLeftColor: "#2563eb" }}>
            <div className="ap-stat-num" style={{ color: "#2563eb" }}>{activeCount}</div>
            <div className="ap-stat-label">Active</div>
          </div>
          <div className="ap-stat-card" style={{ borderLeftColor: "#ef4444" }}>
            <div className="ap-stat-num" style={{ color: "#ef4444" }}>{overdueCount}</div>
            <div className="ap-stat-label">Overdue</div>
          </div>
          <div className="ap-stat-card" style={{ borderLeftColor: "#6b7280" }}>
            <div className="ap-stat-num" style={{ color: "#6b7280" }}>{completedCount}</div>
            <div className="ap-stat-label">Completed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="ap-filters">
          <input
            className="ap-search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="ap-filter-btns">
            {["All", "On track", "At risk", "Overdue", "Completed"].map((s) => (
              <button
                key={s}
                className={`filter-btn ${filterStatus === s ? "active" : ""}`}
                onClick={() => setFilterStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="projects-table">
            <thead>
              <tr>
                <th>PROJECT</th>
                <th>SUPERVISOR</th>
                <th>PROGRESS</th>
                <th>TASKS</th>
                <th>DEADLINE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-results">
                    No projects found
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="project-name">{p.projectName}</div>
                      <div className="project-meta">
                        {p.startDate ? new Date(p.startDate).toLocaleDateString() : ""}
                      </div>
                    </td>
                    <td>
                      <div className="supervisor-cell">
                        <div className="avatar" style={{ background: "#0891b2" }}>
                          {p.supervisor?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span>{p.supervisor?.name || "Unassigned"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-progress-bar">
                        <div
                          className="table-progress-fill"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                      <span className="progress-pct">—</span>
                    </td>
                    <td className="tasks-cell">—</td>
                      
                    <td className="deadline-cell">
                      {p.endDate ? new Date(p.endDate).toLocaleDateString() : "—"}
                    </td>
                    <td>
                      <span className="status-badge">
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-view" onClick={() => setViewProject(p)}>View</button>
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setEditingId(p._id);
                            setForm({
                              projectName: p.projectName,
                              description: p.description,
                              supervisor: p.supervisor?._id || "",
                              priority: p.priority,
                              startDate: p.startDate ? p.startDate.slice(0, 10) : "",
                              endDate: p.endDate ? p.endDate.slice(0, 10) : "",
                            });
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(p._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Total count */}
        <div className="ap-footer">
          Showing {filtered.length} of {allProjects.length} projects
        </div>
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Edit Project" : "Create New Project"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Project Title</label>
                <input
                  placeholder="e.g. SOC Playbook Automation"
                  value={form.projectName}
                  onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="What is this project about?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Supervisor</label>
                  <select
                    value={form.supervisor}
                    onChange={(e) => setForm({ ...form, supervisor: e.target.value })}
                  >
                    <option value="">Select supervisor</option>
                    {supervisors.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn-create" onClick={handleCreate}>
                {editingId ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* View Project Modal */}
      {viewProject && (
        <div className="modal-overlay" onClick={() => setViewProject(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{viewProject.projectName}</h2>
              <button className="modal-close" onClick={() => setViewProject(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p><strong>Description:</strong> {viewProject.description}</p>
              <p><strong>Supervisor:</strong> {viewProject.supervisor?.name || "Unassigned"}</p>
              <p><strong>Priority:</strong> {viewProject.priority}</p>
              <p><strong>Status:</strong> {viewProject.status}</p>
              <p><strong>Start Date:</strong> {viewProject.startDate ? new Date(viewProject.startDate).toLocaleDateString() : "—"}</p>
              <p><strong>Deadline:</strong> {viewProject.endDate ? new Date(viewProject.endDate).toLocaleDateString() : "—"}</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setViewProject(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllProjects;