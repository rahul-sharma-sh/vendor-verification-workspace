import nodemailer from "nodemailer";
import { env } from "../configs/env";

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

export async function sendMissingDocumentEmail(
  vendorEmail: string,
  vendorName: string,
  missingDocuments: string[]
) {
  if (!env.smtpUser || !env.smtpPass) {
    throw new Error("SMTP email configuration is missing");
  }

  const documentLabels: Record<string, string> = {
    registration: "Registration Certificate",
    gst: "GST Certificate",
    bank: "Bank Document",
  };

  const documentList = missingDocuments
    .map(
      (document) =>
        `<li>${documentLabels[document] || document}</li>`
    )
    .join("");

  const result = await transporter.sendMail({
    from: `"Vendor Verification System" <${env.smtpUser}>`,
    to: vendorEmail,
    subject: "Action Required - Missing Vendor Documents",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Missing Documents Required</h2>

        <p>Hello ${vendorName},</p>

        <p>
          During the vendor verification process, we found
          that the following documents are missing:
        </p>

        <ul>
          ${documentList}
        </ul>

        <p>
          Please upload the required documents to continue
          the vendor verification process.
        </p>

        <p>
          Regards,<br />
          Vendor Verification Team
        </p>
      </div>
    `,
  });

  return {
    messageId: result.messageId,
    accepted: result.accepted,
    rejected: result.rejected,
  };
}