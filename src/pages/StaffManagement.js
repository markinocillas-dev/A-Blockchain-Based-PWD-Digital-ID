import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StaffManagement.css";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [newStaff, setNewStaff] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    accounttype: "staff",
  });
  const [editingStaff, setEditingStaff] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/staff");
      setStaffList(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleChange = (e) => {
    setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.firstname || !newStaff.lastname || !newStaff.username || !newStaff.password) {
      return alert("Please fill in all fields.");
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8081/api/staff", newStaff);
      alert("✅ Staff added successfully!");
      setNewStaff({ firstname: "", lastname: "", username: "", password: "", accounttype: "staff" });
      fetchStaff();
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("❌ Failed to add staff.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (staff) => {
    setEditingStaff(staff);
  };

  const handleEditChange = (e) => {
    setEditingStaff({ ...editingStaff, [e.target.name]: e.target.value });
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`http://localhost:8081/api/staff/${editingStaff.id}`, editingStaff);
      alert("✅ Staff updated successfully!");
      setEditingStaff(null);
      fetchStaff();
    } catch (error) {
      console.error("Error updating staff:", error);
      alert("❌ Failed to update staff.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/staff/${id}`);
      alert("🗑️ Staff deleted successfully!");
      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("❌ Failed to delete staff.");
    }
  };

  return (
    <div className="staff-container">
      <div className="staff-card">
        <h2 className="staff-title">👥 Staff Management</h2>
        <p className="staff-subtext">Add, edit, and manage staff members efficiently.</p>

        {/* Add Staff Form */}
        <form onSubmit={handleAddStaff} className="staff-form">
          <div className="form-row">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={newStaff.firstname}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={newStaff.lastname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={newStaff.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newStaff.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="add-btn" disabled={loading}>
            {loading ? "Adding..." : "➕ Add Staff"}
          </button>
        </form>

        {/* Staff Table */}
        <div className="table-wrapper">
          <table className="staff-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Account Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.length > 0 ? (
                staffList.map((staff) => (
                  <tr key={staff.id}>
                    <td>{staff.id}</td>
                    <td>{staff.firstname} {staff.lastname}</td>
                    <td>{staff.username}</td>
                    <td>{staff.accounttype}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEditClick(staff)}>✏️ Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteStaff(staff.id)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>No staff found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingStaff && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Edit Staff</h3>
            <form onSubmit={handleUpdateStaff} className="modal-form">
              <input
                type="text"
                name="firstname"
                value={editingStaff.firstname}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="lastname"
                value={editingStaff.lastname}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="username"
                value={editingStaff.username}
                onChange={handleEditChange}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : "💾 Save"}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setEditingStaff(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
