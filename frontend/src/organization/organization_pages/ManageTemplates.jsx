import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import "./managetemplate.css";

export default function ManageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [viewingTemplate, setViewingTemplate] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("org_token");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/template/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setTemplates(data.templates || []);
        } else {
          setMessage(data.message || "Failed to fetch templates");
        }
      } catch (err) {
        setMessage("Error fetching templates");
        console.error(err);
      }
    };

    fetchTemplates();
  }, []);

  const deleteTemplate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/template/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTemplates((prev) => prev.filter((t) => t._id !== id));
        setMessage("Template deleted successfully!");
      } else {
        setMessage(data.message || "Failed to delete template");
      }
    } catch (err) {
      setMessage("Error deleting template");
      console.error(err);
    }
  };

  return (
    <div className="mt-wrap">
      {/* Title */}
      <h2 className="mt-title">Manage Templates</h2>

      {/* Notification */}
      {message && <div className="mt-message">{message}</div>}

      {/* No Data */}
      {templates.length === 0 ? (
        <div className="mt-empty">
          No templates found.
          <span>Create one from the dashboard.</span>
        </div>
      ) : (
        <div className="mt-grid">
          {templates.map((t) => (
            <div key={t._id} className="mt-card">
              {/* Card header */}
              <div className="mt-card-header">
                <FaTrash
                  className="mt-card-icon delete-icon"
                  title="Delete Template"
                  onClick={() => deleteTemplate(t._id)}
                />
              </div>

              {/* Title */}
              <h3 className="mt-card-title">{t.templateName}</h3>

              {/* Field chips */}
              <div className="mt-field-chips">
                {t.fields.slice(0, 2).map((f, i) => (
                  <span key={i} className="mt-chip">
                    {f.label}
                  </span>
                ))}
                {t.fields.length > 2 && (
                  <span className="mt-chip">+{t.fields.length - 2} more</span>
                )}
              </div>

              {/* View button */}
              <button
                className="mt-btn-view"
                onClick={() => setViewingTemplate(t)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {viewingTemplate && (
        <div className="mt-modal">
          <div className="mt-modal-content mt-animate">
            <h3 className="mt-modal-title">{viewingTemplate.templateName}</h3>

            <div className="mt-fields-list">
              {viewingTemplate.fields.map((f, i) => (
                <div key={i} className="mt-field-row">
                  <span className="mt-field-label">{f.label}</span>
                  <span className="mt-field-type">{f.type}</span>
                  {f.required && <span className="mt-field-req">Required</span>}
                </div>
              ))}
            </div>

            <button className="mt-btn-close" onClick={() => setViewingTemplate(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
