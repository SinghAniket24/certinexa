import React, { useState } from "react";
import "./IssueCertificate.css";

export default function BulkIssueCertificate({ templates, token }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleBulkIssue = async () => {
    if (!selectedTemplateId || !excelFile) {
      alert("Please select a template and upload an Excel file");
      return;
    }

    const selectedTemplate = templates.find(
      (t) => t._id === selectedTemplateId
    );

    if (!selectedTemplate) {
      alert("Invalid template selected");
      return;
    }

    const formData = new FormData();
    formData.append("templateName", selectedTemplate.templateName);
    formData.append("file", excelFile);

    try {
      setLoading(true);
      setResult(null);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/certificate/bulk-issue`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult({
          total: data.total,
          issued: data.issued,
          failed: data.failed,
        });
      } else {
        alert(data.message || "Bulk issuance failed");
      }
    } catch (err) {
      console.error("Bulk issue error:", err);
      alert("Something went wrong during bulk issuance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ic-bulk-wrap">
      <center>
        <h3 className="ic-subtitle">Bulk Issue Certificates</h3>
      </center>

      <br />

      {/* TEMPLATE SELECT */}
      <div className="ic-template-select">
        <label>Select Template:</label>
        <select
          value={selectedTemplateId}
          onChange={(e) => setSelectedTemplateId(e.target.value)}
        >
          <option value="" disabled>
            -- Choose Template --
          </option>
          {templates.map((t) => (
            <option key={t._id} value={t._id}>
              {t.templateName}
            </option>
          ))}
        </select>
      </div>

      <br />

      {/* EXCEL UPLOAD */}
      <div className="ic-form-group">
        <label>Upload Excel File</label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setExcelFile(e.target.files[0])}
        />
      </div>

      <br />
      <br />

      {/* ACTION BUTTON */}
      <center>
        <button
          className="ic-btn-submit"
          onClick={handleBulkIssue}
          disabled={loading}
          style={{ maxWidth: "320px" }}
        >
          {loading ? "Issuing Certificates..." : "Bulk Issue Certificates"}
        </button>
      </center>

      <br />

      {/* RESULT SUMMARY */}
      {result && (
        <>
          <br />
          <div className="ic-bulk-result">
            <p>
              <strong>Total:</strong> {result.total}
            </p>
            <p style={{ color: "green" }}>
              <strong>Issued:</strong> {result.issued}
            </p>
            <p style={{ color: "red" }}>
              <strong>Failed:</strong> {result.failed}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
