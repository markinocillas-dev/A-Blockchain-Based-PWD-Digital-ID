import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Beneficiaries.css";

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    suffix: "",
    gender: "",
    age: "",
    birthdate: "",
    disability_type: "",
    id_number: "",
  });

  const API_URL = "http://localhost:8081/api/beneficiaries";

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const res = await axios.get(API_URL);
      setBeneficiaries(res.data);
    } catch (err) {
      console.error("Error fetching beneficiaries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await axios.post(`${API_URL}/${id}/${action}`);
      fetchBeneficiaries();
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this beneficiary?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchBeneficiaries();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["firstname", "lastname", "gender", "age", "birthdate", "disability_type", "id_number"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in ${field.replace("_", " ")}.`);
        return;
      }
    }

    try {
      if (editing) {
        await axios.put(`${API_URL}/${editing}`, formData);
        setEditing(null);
      } else {
        await axios.post(API_URL, { ...formData, status: "pending" });
      }

      setFormData({
        firstname: "",
        lastname: "",
        middlename: "",
        suffix: "",
        gender: "",
        age: "",
        birthdate: "",
        disability_type: "",
        id_number: "",
      });
      fetchBeneficiaries();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleEdit = (b) => {
    setEditing(b.id);
    setFormData({
      firstname: b.firstname || "",
      lastname: b.lastname || "",
      middlename: b.middlename || "",
      suffix: b.suffix || "",
      gender: b.gender || "",
      age: b.age || "",
      birthdate: b.birthdate ? b.birthdate.split("T")[0] : "",
      disability_type: b.disability_type || "",
      id_number: b.id_number || "",
    });
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setFormData({
      firstname: "",
      lastname: "",
      middlename: "",
      suffix: "",
      gender: "",
      age: "",
      birthdate: "",
      disability_type: "",
      id_number: "",
    });
  };

  if (loading) return <p className="loading-text">Loading beneficiaries...</p>;

  return (
    <div className="beneficiaries-container">
      <h2 className="page-title">Beneficiaries</h2>

      {/* Add/Edit Form */}
      <div className="form-card">
        <h3>{editing ? "Edit Beneficiary" : "Add New Beneficiary"}</h3>
        <form onSubmit={handleSubmit} className="beneficiary-form">
          <input
            type="text"
            placeholder="First Name *"
            value={formData.firstname}
            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name *"
            value={formData.lastname}
            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
          />
          <input
            type="text"
            placeholder="Middle Name (optional)"
            value={formData.middlename}
            onChange={(e) => setFormData({ ...formData, middlename: e.target.value })}
          />
          <input
            type="text"
            placeholder="Suffix (optional)"
            value={formData.suffix}
            onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
          />
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          >
            <option value="">Select Gender *</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="number"
            placeholder="Age *"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
          <input
            type="date"
            placeholder="Birthdate *"
            value={formData.birthdate}
            onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
          />
          <input
            type="text"
            placeholder="Disability Type *"
            value={formData.disability_type}
            onChange={(e) => setFormData({ ...formData, disability_type: e.target.value })}
          />
          <input
            type="text"
            placeholder="ID Number *"
            value={formData.id_number}
            onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
          />

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              {editing ? "Update" : "Add"}
            </button>
            {editing && (
              <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Beneficiaries Table */}
      <div className="table-card">
        {beneficiaries.length === 0 ? (
          <p className="no-data">No beneficiaries found.</p>
        ) : (
          <table className="beneficiaries-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Birthdate</th>
                <th>Disability Type</th>
                <th>ID Number</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((b, index) => (
                <tr key={b.id}>
                  <td>{index + 1}</td>
                  <td>
                    {b.firstname} {b.middlename ? b.middlename + " " : ""}
                    {b.lastname} {b.suffix ? b.suffix : ""}
                  </td>
                  <td>{b.gender}</td>
                  <td>{b.age}</td>
                  <td>{b.birthdate ? b.birthdate.split("T")[0] : ""}</td>
                  <td>{b.disability_type}</td>
                  <td>{b.id_number}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        b.status === "approved"
                          ? "approved"
                          : b.status === "rejected"
                          ? "rejected"
                          : "pending"
                      }`}
                    >
                      {b.status
                        ? b.status.charAt(0).toUpperCase() + b.status.slice(1)
                        : "Pending"}
                    </span>
                  </td>
                  <td>
                    {b.status === "pending" && (
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() => handleAction(b.id, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleAction(b.id, "reject")}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    <div className="crud-buttons">
                      <button className="edit-btn" onClick={() => handleEdit(b)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(b.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Beneficiaries;
