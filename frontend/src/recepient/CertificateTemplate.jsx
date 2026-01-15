import React, { forwardRef } from "react";
import "./certificate_template.css";

const CertificateTemplate = forwardRef(({ data }, ref) => {
  if (!data) return null;

  return (
    <div style={{ position: "absolute", left: "-9999px" }}> {/* Hide from view */}
      <div ref={ref} className="cert-print-area">
        <div className="cert-border">
          <div className="cert-inner">
            <h1 className="cert-brand">CertiNexa</h1>
            <div className="cert-content">
              <h2 className="cert-header">Certificate of Achievement</h2>
              <p className="cert-text">This is to certify that</p>
              <h3 className="cert-recipient">{data.recipientEmail}</h3>
              <p className="cert-text">has successfully completed</p>
              <h3 className="cert-course">{data.certificateName}</h3>
              <p className="cert-org">Issued by {data.orgName}</p>
            </div>
            
            <div className="cert-footer">
              <div className="cert-meta">
                <span>Date: {new Date(data.issuedAt).toLocaleDateString()}</span>
                <span>ID: {data.certificateId}</span>
              </div>
              <div className="cert-seal">
                VERIFIED BY BLOCKCHAIN
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CertificateTemplate;