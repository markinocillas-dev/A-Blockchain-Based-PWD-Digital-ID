import React from "react";
import "./DashboardHome.css";

const DashboardHome = ({ admins, beneficiaries }) => {
  const activeAdmins = admins.filter((a) => a.status === "active");
  const inactiveAdmins = admins.filter((a) => a.status === "inactive");

  return (
    <div className="cards-grid">
      {/* ACTIVE ADMINS */}
      <div className="card">
        <h3>Active Admins</h3>
        <p className="count">{activeAdmins.length}</p>
        {activeAdmins.length > 0 ? (
          <ul className="admin-list">
            {activeAdmins.map((a) => (
              <li key={a.id}>
                {a.firstname} {a.lastname}
              </li>
            ))}
          </ul>
        ) : (
          <p>No active admins.</p>
        )}
      </div>

      {/* INACTIVE ADMINS */}
      <div className="card">
        <h3>Inactive Admins</h3>
        <p className="count">{inactiveAdmins.length}</p>
        {inactiveAdmins.length > 0 ? (
          <ul className="admin-list inactive">
            {inactiveAdmins.map((a) => (
              <li key={a.id}>
                {a.firstname} {a.lastname}
              </li>
            ))}
          </ul>
        ) : (
          <p>No inactive admins.</p>
        )}
      </div>

      {/* TOTAL BENEFICIARIES */}
      <div className="card">
        <h3>Total Beneficiaries</h3>
        <p className="count">{beneficiaries.length}</p>
      </div>
    </div>
  );
};

export default DashboardHome;