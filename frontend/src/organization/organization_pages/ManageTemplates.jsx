import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import "./managetemplate.css";

export default function ManageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [viewingTemplate, setViewingTemplate] = useState(null);
  const [message, setMessage] = useState(""); // For success/error messages
  const token = localStorage.getItem("org_token"); // JWT

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/template/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTemplates(data.templates || []);
        } else {
          console.error(data.message || "Failed to fetch templates");
          setMessage(data.message || "Failed to fetch templates");
        }
      } catch (err) {
        console.error("Error fetching templates:", err);
        setMessage("Error fetching templates");
      }
    };

    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // keep empty array since token won't change

  const deleteTemplate = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this template?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/template/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTemplates(prev => prev.filter(t => t._id !== id));
        setMessage("Template deleted successfully!");
      } else {
        console.error(data.message || "Failed to delete template");
        setMessage(data.message || "Failed to delete template");
      }
    } catch (err) {
      console.error("Error deleting template:", err);
      setMessage("Error deleting template");
    }
  };

  const viewTemplate = (template) => setViewingTemplate(template);
  const closeView = () => setViewingTemplate(null);

  return (
    <div className="mt-wrap">
      <h2 className="mt-title">Manage Templates</h2>

      {message && <div className="mt-message">{message}</div>}

      {templates.length === 0 ? (
        <div className="mt-empty">
          No templates found.
          <span>Create one from the dashboard.</span>
        </div>
      ) : (
        <div className="mt-grid">
          {templates.map((t) => (
            <div key={t._id} className="mt-card">
              <div className="mt-card-header">
                <div className="mt-card-actions">
                  <FaTrash
                    className="mt-card-icon delete-icon"
                    title="Delete Template"
                    onClick={() => deleteTemplate(t._id)}
                  />
                </div>
              </div>

              <h3 className="mt-card-title">{t.templateName}</h3>

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
            <h3>{viewingTemplate.templateName}</h3>
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
