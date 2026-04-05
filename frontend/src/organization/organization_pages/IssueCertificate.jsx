import React, { useState, useEffect } from "react";
import "./IssueCertificate.css";
import BulkIssueCertificate from "./BulkIssueCertificate"; 

export default function IssueCertificate() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [mode, setMode] = useState("single"); // single | bulk
  const [loading, setLoading] = useState(false);

  // Dialog state
  const [dialog, setDialog] = useState({
    open: false,
    message: "",
    type: "success"
  });

  const token = localStorage.getItem("org_token");

  // Fetch templates on load
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/template/list`, {
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
    const template = templates.find((t) => t._id === templateId);
    setSelectedTemplate(template);

    if (template) {
      const initialData = {};
      template.fields.forEach((f) => {
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
      setDialog({
        open: true,
        message: "Email is required!",
        type: "error"
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/certificate/issue`, {
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
        setDialog({
          open: true,
          message: "Certificate issued successfully!",
          type: "success"
        });
        setSelectedTemplate(null);
        setFormData({});
      } else {
        setDialog({
          open: true,
          message: result.message || "Error issuing certificate",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error issuing certificate:", error);
      setDialog({
        open: true,
        message: "Something went wrong!",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ic-wrap">
      <h2 className="ic-title">Issue Certificate</h2>

      {/* 🔀 MODE TOGGLE */}
      <div className="ic-toggle">
        <button
          className={mode === "single" ? "active" : ""}
          onClick={() => {
            setMode("single");
            setSelectedTemplate(null);
          }}
        >
          Single Issue
        </button>
        <button
          className={mode === "bulk" ? "active" : ""}
          onClick={() => {
            setMode("bulk");
            setSelectedTemplate(null);
          }}
        >
          Bulk Issue
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="ic-empty">
          No templates available. Create one first.
        </div>
      ) : (
        <div className="ic-content">
          {mode === "single" && (
            <>
              {!selectedTemplate ? (
                <div className="ic-template-select">
                  <label>Select Template:</label>
                  <select
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    defaultValue=""
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
              ) : (
                <form className="ic-form" onSubmit={handleSubmit}>
                  {selectedTemplate.fields.map((f, idx) => (
                    <div className="ic-form-group" key={idx}>
                      <label>
                        {f.label}
                        {f.label === "Email" ? " *" : ""}
                      </label>
                      <input
                        type={f.type || "text"}
                        value={formData[f.label] || ""}
                        onChange={(e) => handleChange(e, f.label)}
                        required={f.label === "Email"}
                        placeholder={`Enter ${f.label}`}
                      />
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="ic-btn-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Issuing on Blockchain...
                      </>
                    ) : (
                      "Issue Certificate"
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {mode === "bulk" && (
            <BulkIssueCertificate
              templates={templates}
              token={token}
            />
          )}
        </div>
      )}

      {/*  DIALOG BOX */}
      {dialog.open && (
        <div className="ic-dialog-overlay">
          <div className={`ic-dialog-box ${dialog.type}`}>
            <p>{dialog.message}</p>
            <button onClick={() => setDialog({ ...dialog, open: false })}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}