// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendCertificateMail = async ({
//   to,
//   certificateId,
//   certificateName,
//   issuer,
//   issuedAt,
// }) => {

//   // ✅ Recipient portal link (UPDATED)
//   const recipientPortalLink = "http://localhost:3000/recepient/login";

//   const mailOptions = {
//     from: `"CertiNexa" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: "🎓 Your Certificate Has Been Issued",
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//         <h2>Certificate Issued Successfully 🎉</h2>

//         <p>Your certificate has been officially issued on <strong>CertiNexa</strong>.</p>

//         <table style="border-collapse: collapse;">
//           <tr>
//             <td><strong>Certificate Name:</strong></td>
//             <td>${certificateName}</td>
//           </tr>
//           <tr>
//             <td><strong>Certificate ID:</strong></td>
//             <td>${certificateId}</td>
//           </tr>
//           <tr>
//             <td><strong>Issued By:</strong></td>
//             <td>${issuer}</td>
//           </tr>
//           <tr>
//             <td><strong>Issued On:</strong></td>
//             <td>${new Date(issuedAt).toLocaleString()}</td>
//           </tr>
//         </table>

//         <p>
//           🔐 This certificate is secured using blockchain technology and is tamper-proof.
//         </p>

//         <p>
//           👉 <a href="${recipientPortalLink}" target="_blank">
//             Login to Recipient Portal
//           </a>
//         </p>

//         <p>
//           After login, you can view and verify your certificate anytime.
//         </p>

//         <hr />
//         <p style="font-size: 13px; color: #666;">
//           This is an automated email from CertiNexa. Please do not reply.
//         </p>
//       </div>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = { sendCertificateMail };
