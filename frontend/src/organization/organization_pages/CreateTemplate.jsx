import React, { useState, useEffect } from "react";
import "./createtemplate.css";

export default function CreateTemplate({ onSaved }) {
  const [templateName, setTemplateName] = useState("");
  const [fields, setFields] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("org_token"); // get JWT

  useEffect(() => {
    setFields(prev => {
      const hasEmail = prev.some(f => f.key === "email");
      if (!hasEmail) {
        return [{ key: "email", label: "Email", type: "email", required: true }, ...prev];
      }
      return prev;
    });
  }, []);

  const addField = () => {
    const newField = { key: `field_${Date.now()}`, label: "", type: "text", required: false };
    setFields(prev => [...prev, newField]);
  };

  const updateField = (key, changes) => {
    setFields(prev => prev.map(f => (f.key === key ? { ...f, ...changes } : f)));
  };

  const removeField = (key) => {
    if (key === "email") return;
    setFields(prev => prev.filter(f => f.key !== key));
  };

  const validate = () => {
    if (!templateName.trim()) {
      setMessage("Template name is required.");
      return false;
    }
    const emailField = fields.find(f => f.key === "email");
    if (!emailField) {
      setMessage("Email field missing.");
      return false;
    }
    for (const f of fields) {
      if (!f.label || !f.label.trim()) {
        setMessage("All fields must have labels.");
        return false;
      }
    }
    setMessage("");
    return true;
  };

  const saveTemplate = async () => {
    if (!validate()) return;

    const template = {
      templateName: templateName.trim(),
      fields: fields.map(f => ({ label: f.label.trim(), type: f.type, required: !!f.required }))
    };

    try {
      const response = await fetch("http://localhost:5000/api/template/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // send JWT
        },
        body: JSON.stringify(template)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Template saved successfully!");
        console.log("Saved Template:", data.template);

        // trigger callback if provided
        if (typeof onSaved === "function") onSaved(data.template);

        // reset form
        setTemplateName("");
        setFields([{ key: "email", label: "Email", type: "email", required: true }]);
      } else {
        setMessage(data.message || "Failed to save template.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="create-template-wrap">
      <h2 className="ct-title">Create Template</h2>

      <div className="ct-card">
        <label className="ct-label">Template Name</label>
        <input
          className="ct-input"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="e.g. Course Completion"
        />

        <div className="fields-header">
          <h3>Fields</h3>
          <button className="ct-small-btn" onClick={addField}>+ Add Field</button>
        </div>

        <div className="fields-list">
          {fields.map((f) => (
            <div key={f.key} className="field-row">
              <input
                className="field-label"
                value={f.label}
                onChange={(e) => updateField(f.key, { label: e.target.value })}
                placeholder={f.key === "email" ? "Email (required)" : "Field label"}
                disabled={f.key === "email"}
              />
              <select
                className="field-type"
                value={f.type}
                onChange={(e) => updateField(f.key, { type: e.target.value })}
                disabled={f.key === "email"}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="date">Date</option>
                <option value="number">Number</option>
              </select>

              <label className="field-required">
                <input
                  type="checkbox"
                  checked={!!f.required}
                  onChange={(e) => updateField(f.key, { required: e.target.checked })}
                  disabled={f.key === "email"}
                />
                Required
              </label>

              <button
                className="field-remove"
                onClick={() => removeField(f.key)}
                disabled={f.key === "email"}
                title={f.key === "email" ? "Email is mandatory" : "Remove field"}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="ct-actions">
          <button className="ct-save" onClick={saveTemplate}>Save Template</button>
          <button
            className="ct-cancel"
            onClick={() => {
              setTemplateName("");
              setFields([{ key: "email", label: "Email", type: "email", required: true }]);
              setMessage("");
            }}
          >
            Reset
          </button>
        </div>

        {message && <div className="ct-message">{message}</div>}
      </div>
    </div>
  );
}
