const nodemailer = require('nodemailer');

// Initialize the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your specific SMTP host
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email app password (not login password)
  },
});

const sendStatusEmail = async (organization, status, reason = '') => {
  try {
    let subject = '';
    let htmlContent = '';

    if (status === 'verified') {
      subject = 'CertiNexa: Organization Verification Approved';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Congratulations, ${organization.name}!</h2>
          <p>We are pleased to inform you that your organization has been <strong>successfully verified</strong> on CertiNexa.</p>
          <p>You can now log in to your issuer portal and begin issuing certificates.</p>
          <a href="http://localhost:3000/organization/login" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Portal</a>
          <p>Welcome aboard,<br>The CertiNexa Team</p>
        </div>
      `;
    } else if (status === 'revoked' || status === 'rejected') { // Assuming 'revoked' or custom 'rejected' status
      subject = 'CertiNexa: Organization Verification Update';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello ${organization.name},</h2>
          <p>We regret to inform you that your organization verification request has been <strong>${status}</strong>.</p>
          <div style="background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin: 10px 0;">
            <strong>Reason:</strong> ${reason}
          </div>
          <p>If you believe this is an error or if you have rectified the issues, please contact our support team or re-apply.</p>
          <p>Regards,<br>The CertiNexa Team</p>
        </div>
      `;
    }

    const mailOptions = {
      from: `"CertiNexa Admin" <${process.env.EMAIL_USER}>`,
      to: organization.officialEmail,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${organization.email} regarding ${status} status.`);
    return true;

  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendStatusEmail };