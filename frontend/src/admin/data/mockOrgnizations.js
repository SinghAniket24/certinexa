export const mockOrganizations = [
    {
      org_id: 1,
      name: "Tech Institute of Mumbai",
      registrationNumber: "REG-2025-001",
      email: "admin@techinst.edu",
      phone: "+91 98765 43210",
      industryType: "Education",
      verificationStatus: "pending", // pending, approved, revoked/rejected
      documents: ["license.pdf", "tax_record.pdf"],
      walletAddress: "0x123...abc"
    },
    {
      org_id: 2,
      name: "Global Health Certifiers",
      registrationNumber: "HLT-998-US",
      email: "verify@globalhealth.org",
      phone: "+1 555 0199",
      industryType: "Healthcare",
      verificationStatus: "approved",
      documents: ["incorporation.pdf"],
      walletAddress: "0x456...def"
    },
    {
      org_id: 3,
      name: "Fake Degree Mill Ltd.",
      registrationNumber: "BAD-ACTOR-00",
      email: "scam@fakedomain.com",
      phone: "+91 00000 00000",
      industryType: "Education",
      verificationStatus: "rejected",
      rejectionReason: "Invalid government registration.",
      documents: ["fake.jpg"],
      walletAddress: "0x789...ghi"
    }
  ];