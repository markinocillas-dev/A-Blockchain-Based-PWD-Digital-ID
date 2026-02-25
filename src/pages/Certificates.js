import React, { useState } from "react";
import axios from "axios";
import "./Certificates.css";

const Certificates = ({ beneficiaries }) => {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadCertificate = async () => {
    if (!selectedBeneficiary || !certificateFile) {
      return alert("Please select a beneficiary and a file first!");
    }

    const formData = new FormData();
    formData.append("certificate", certificateFile);

    try {
      setUploading(true);
      await axios.post(
        `http://localhost:8081/api/certificates/${selectedBeneficiary}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("✅ Certificate uploaded successfully!");
      setSelectedBeneficiary("");
      setCertificateFile(null);
    } catch (err) {
      console.error("Error uploading certificate:", err);
      alert("❌ Failed to upload certificate.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="certificates-container">
      <div className="upload-card">
        <h2 className="upload-title">📄 Upload Certificate</h2>
        <p className="upload-subtext">
          Attach a certificate file to a selected beneficiary.
        </p>

        {/* Beneficiary Dropdown */}
        <div className="form-group">
          <label>Select Beneficiary</label>
          <select
            value={selectedBeneficiary}
            onChange={(e) => setSelectedBeneficiary(e.target.value)}
          >
            <option value="">-- Choose Beneficiary --</option>
            {beneficiaries && beneficiaries.length > 0 ? (
              beneficiaries.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.firstname} {b.lastname}
                </option>
              ))
            ) : (
              <option disabled>Loading beneficiaries...</option>
            )}
          </select>
        </div>

        {/* File Input */}
        <div className="form-group">
          <label>Certificate File</label>
          <input
            type="file"
            accept=".pdf,.jpg,.png,.jpeg"
            onChange={(e) => setCertificateFile(e.target.files[0])}
          />
        </div>

        {/* Upload Button */}
        <button
          className={`upload-btn ${uploading ? "uploading" : ""}`}
          onClick={handleUploadCertificate}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Certificate"}
        </button>
      </div>
    </div>
  );
};

export default Certificates;
