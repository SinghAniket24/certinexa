import React, { useState, useEffect } from "react";
import "./IssueCertificate.css";

export default function IssueCertificate() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("org_token"); // JWT

  // Fetch templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/template/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setTemplates(data.templates || []);
        } else {
          console.error(data.message || "Failed to fetch templates");
        }
      } catch (err) {
        console.error("Error fetching templates:", err);
      }
    };

    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t._id === templateId);
    setSelectedTemplate(template);

    if (template) {
      const initialData = {};
      template.fields.forEach(f => {
        initialData[f.label] = "";
      });
      setFormData(initialData);
    }
  };

  const handleChange = (e, label) => {
    setFormData({
      ...formData,
      [label]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData["Email"]) {
      alert("Email is required!");
      return;
    }

    const newCert = {
      id: Date.now(),
      templateName: selectedTemplate.templateName,
      fields: formData,
      issuedAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem("issued_certificates") || "[]");
    existing.push(newCert);
    localStorage.setItem("issued_certificates", JSON.stringify(existing));

    alert("Certificate issued and saved locally!");

    setSelectedTemplate(null);
    setFormData({});
  };

  return (
    <div className="ic-wrap">
      <h2 className="ic-title">Issue Certificate</h2>

      {templates.length === 0 ? (
        <div className="ic-empty">No templates available. Create one first.</div>
      ) : (
        <div className="ic-content">
          {!selectedTemplate ? (
            <div className="ic-template-select">
              <label>Select Template:</label>
              <select onChange={(e) => handleTemplateSelect(e.target.value)} defaultValue="">
                <option value="" disabled>-- Choose Template --</option>
                {templates.map(t => (
                  <option key={t._id} value={t._id}>{t.templateName}</option>
                ))}
              </select>
            </div>
          ) : (
            <form className="ic-form" onSubmit={handleSubmit}>
              {selectedTemplate.fields.map((f, idx) => (
                <div className="ic-form-group" key={idx}>
                  <label>{f.label}{f.label === "Email" ? " *" : ""}</label>
                  <input
                    type={f.type || "text"}
                    value={formData[f.label] || ""}
                    onChange={(e) => handleChange(e, f.label)}
                    required={f.label === "Email"}
                    placeholder={`Enter ${f.label}`}
                  />
                </div>
              ))}
              <button type="submit" className="ic-btn-submit">Issue Certificate</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
