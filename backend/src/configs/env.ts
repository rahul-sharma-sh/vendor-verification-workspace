import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),

  mongodbUri:
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/vendor-verification-workspace",

  openaiApiKey: process.env.OPENAI_API_KEY || "",

  geminiApiKey: process.env.GEMINI_API_KEY || "",

  openCorporatesApiKey:
    process.env.OPENCORPORATES_API_KEY || "",

  resendApiKey:
    process.env.RESEND_API_KEY || "",

  emailFrom:
    process.env.EMAIL_FROM || "",

  smtpHost:
    process.env.SMTP_HOST || "smtp.gmail.com",

  smtpPort:
    Number(process.env.SMTP_PORT || 587),

  smtpUser:
    process.env.SMTP_USER || "",

  smtpPass:
    process.env.SMTP_PASS || "",
};