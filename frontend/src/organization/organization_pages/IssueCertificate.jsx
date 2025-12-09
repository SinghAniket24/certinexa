import React, { useState, useEffect } from "react";
import "./IssueCertificate.css";

export default function IssueCertificate() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("org_token"); // JWT Token

  // Fetch templates on load
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
  }, [token]);

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
    setFormData({ ...formData, [label]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const primaryEmail = formData["Email"];
    if (!primaryEmail) {
      alert("Email is required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/certificate/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          templateName: selectedTemplate.templateName,
          email: primaryEmail,
          fields: formData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Response from backend:", result);
        alert("Certificate issued successfully!");
        setSelectedTemplate(null);
        setFormData({});
      } else {
        alert(result.message || "Error issuing certificate");
      }
    } catch (error) {
      console.error("Error issuing certificate:", error);
      alert("Something went wrong!");
    }
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
                  <option key={t._id} value={t._id}>
                    {t.templateName}
                  </option>
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
              <button type="submit" className="ic-btn-submit">
                Issue Certificate
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
