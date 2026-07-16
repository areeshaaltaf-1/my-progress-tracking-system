import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../assets/styles.css"; 
import { useToast } from "../../context/ToastContext";


function Users() {
  const [activeTab, setActiveTab] = useState("view");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const { showToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users", {
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
});
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name, email, password, role, department };
    try {
      const res = await fetch("http://localhost:5000/api/users/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
  body: JSON.stringify(newUser),
});
      const data = await res.json();
       if (res.ok) {
  showToast("New user added successfully!", "success");
  setName(""); setEmail(""); setPassword(""); setRole(""); setDepartment("");
  fetchUsers();
  setActiveTab("view");
} else {
  showToast(data.message || "Failed to create user", "error");
}
    } catch (err) {
  showToast("Something went wrong.", "error");
}
  };

 const handleDelete = async (id) => {
  if (!window.confirm("Are you sure?")) return;
  try {
    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    if (res.ok) {
      showToast("User deleted successfully!", "success");
      fetchUsers();
    } else {
      const data = await res.json();
      showToast(data.message || "Failed to delete user", "error");
    }
  } catch (err) {
    console.log(err);
    showToast("Something went wrong.", "error");
  }
};
const handleEditClick = (user) => {
  setEditingUser(user);
  setName(user.name);
  setEmail(user.email);
  setRole(user.role);
  setDepartment(user.department);
  setActiveTab("add");
};

const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`http://localhost:5000/api/users/${editingUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, email, role, department }),
    });
    const data = await res.json();
    if (res.ok) {
      showToast("User updated successfully!", "success");
      setName(""); setEmail(""); setPassword(""); setRole(""); setDepartment("");
      setEditingUser(null);
      fetchUsers();
      setActiveTab("view");
    } else {
      showToast(data.message || "Failed to update user", "error");
    }
  } catch (err) {
    showToast("Something went wrong.", "error");
  }
};
  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const getRoleColor = (role) => {
    if (role === "Admin") return "#ef4444";
    if (role === "Supervisor") return "#2563eb";
    if (role === "Internee") return "#14b8a6";
    return "#6b7280";
  };

  const getRoleBadge = (role) => {
    if (role === "Admin") return { color: "#ef4444", bg: "#fee2e2" };
    if (role === "Supervisor") return { color: "#2563eb", bg: "#dbeafe" };
    if (role === "Internee") return { color: "#14b8a6", bg: "#ccfbf1" };
    return { color: "#6b7280", bg: "#f3f4f6" };
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        {/* Header */}
        <div className="users-header">
          <div>
            <h1 className="users-title">Users & Roles</h1>
            <p className="users-sub">Manage organization members and their permissions</p>
          </div>
          <button className="btn-add-user" onClick={() => setActiveTab("add")}>
            + Add User
          </button>
        </div>

        {/* Stats */}
        <div className="users-stats">
          <div className="u-stat" style={{ borderLeftColor: "#ef4444" }}>
            <div className="u-stat-num" style={{ color: "#ef4444" }}>
              {users.filter((u) => u.role === "Admin").length}
            </div>
            <div className="u-stat-label">Admins</div>
          </div>
          <div className="u-stat" style={{ borderLeftColor: "#2563eb" }}>
            <div className="u-stat-num" style={{ color: "#2563eb" }}>
              {users.filter((u) => u.role === "Supervisor").length}
            </div>
            <div className="u-stat-label">Supervisors</div>
          </div>
          <div className="u-stat" style={{ borderLeftColor: "#14b8a6" }}>
            <div className="u-stat-num" style={{ color: "#14b8a6" }}>
              {users.filter((u) => u.role === "Internee").length}
            </div>
            <div className="u-stat-label">Internees</div>
          </div>
          <div className="u-stat" style={{ borderLeftColor: "#6b7280" }}>
            <div className="u-stat-num" style={{ color: "#6b7280" }}>
              {users.length}
            </div>
            <div className="u-stat-label">Total Users</div>
          </div>
        </div>

        {/* VIEW USERS */}
        {activeTab === "view" && (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>DEPARTMENT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="table-empty">Loading users...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="table-empty">No users found. Add one!</td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const badge = getRoleBadge(u.role);
                    return (
                      <tr key={u._id}>
                        <td>
                          <div className="user-cell">
                            <div className="u-avatar" style={{ background: getRoleColor(u.role) }}>
                              {getInitials(u.name)}
                            </div>
                            <span className="u-name">{u.name}</span>
                          </div>
                        </td>
                        <td className="u-email">{u.email}</td>
                        <td>
                          <span className="role-badge" style={{ color: badge.color, background: badge.bg }}>
                            {u.role}
                          </span>
                        </td>
                        <td className="u-dept">{u.department}</td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-edit" onClick={() => handleEditClick(u)}>Edit</button>
                            <button className="btn-delete" onClick={() => handleDelete(u._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ADD USER */}
        {activeTab === "add" && (
          <div className="add-user-wrapper">
            <form className="add-user-form" onSubmit={editingUser ? handleUpdate : handleSubmit}>
             <h2 className="form-title">{editingUser ? "Edit User" : "Add New User"}</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ahmed Raza"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. ahmed@signal.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                {!editingUser && (
  <div className="form-group">
    <label>Password</label>
    <input
      type="password"
      placeholder="Min 6 characters"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>
)}
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Internee">Internee</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
  <label>Department</label>
  <select
    value={department}
    onChange={(e) => setDepartment(e.target.value)}
    required
  >
    <option value="">Select Department</option>
    <option value="Cyber Security">Cyber Security</option>
    <option value="Software Engineering">Software Engineering</option>
    <option value="Artificial Intelligence">Artificial Intelligence</option>
    <option value="Computer Science">Computer Science</option>
  </select>
</div>

              <div className="form-actions">
                <button
  type="button"
  className="btn-cancel"
  onClick={() => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
    setDepartment("");
    setActiveTab("view");
  }}
>
  Cancel
</button>
                <button type="submit" className="btn-create">
  {editingUser ? "Update User" : "Create User"}
</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default Users;