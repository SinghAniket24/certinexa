import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import "./managetemplate.css";

export default function ManageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [viewingTemplate, setViewingTemplate] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("templates_db") || "[]");
    setTemplates(saved);
  }, []);

  const deleteTemplate = (id) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem("templates_db", JSON.stringify(updated));
  };

  const viewTemplate = (template) => setViewingTemplate(template);
  const closeView = () => setViewingTemplate(null);

  return (
    <div className="mt-wrap">
      <h2 className="mt-title">Manage Templates</h2>

      {templates.length === 0 ? (
        <div className="mt-empty">
          No templates found.
          <span>Create one from the dashboard.</span>
        </div>
      ) : (
        <div className="mt-grid">
          {templates.map((t) => (
            <div key={t.id} className="mt-card">
              <div className="mt-card-header">
                <div className="mt-card-actions">
                  <FaTrash
                    className="mt-card-icon delete-icon"
                    title="Delete Template"
                    onClick={() => deleteTemplate(t.id)}
                  />
                </div>
              </div>

              <h3 className="mt-card-title">{t.name}</h3>

              <div className="mt-field-chips">
                {t.fields.slice(0, 2).map((f, i) => (
                  <span key={i} className="mt-chip">{f.label}</span>
                ))}
                {t.fields.length > 2 && (
                  <span className="mt-chip">+{t.fields.length - 2} more</span>
                )}
              </div>

              <button className="mt-btn-view" onClick={() => viewTemplate(t)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {viewingTemplate && (
        <div className="mt-modal">
          <div className="mt-modal-content">
            <h3>{viewingTemplate.name}</h3>
            <div className="mt-fields-list">
              {viewingTemplate.fields.map((f, i) => (
                <div key={i} className="mt-field-row">
                  <span className="mt-field-label">{f.label}</span>
                  <span className="mt-field-type">{f.type}</span>
                  {f.required && <span className="mt-field-req">Required</span>}
                </div>
              ))}
            </div>
            <button className="mt-btn-close" onClick={closeView}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
