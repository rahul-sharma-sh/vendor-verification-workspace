import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import { env } from "../configs/env";

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

export interface ExtractedVendorData {
  companyName?: string;
  registrationNumber?: string;
  gstNumber?: string;
  address?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
}

const extractionInstruction = `
You are a document verification assistant.

Extract vendor/company information from the provided document.

Return ONLY valid JSON using exactly these fields:

{
  "companyName": "",
  "registrationNumber": "",
  "gstNumber": "",
  "address": "",
  "bankAccountNumber": "",
  "ifscCode": ""
}

Rules:
- Do not invent information.
- If a field is unavailable, return an empty string.
- Preserve registration numbers exactly as written.
- Preserve GST numbers exactly as written.
- Preserve bank account numbers exactly as written.
- Preserve IFSC codes exactly as written.
- Extract the company name exactly as written.
- Extract the address exactly as written when available.
- Ignore unrelated personal information.
`;

function parseAIResponse(content: string): ExtractedVendorData {
  try {
    return JSON.parse(content);
  } catch {
    const cleaned = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return JSON.parse(cleaned);
  }
}

export async function extractVendorDataFromText(
  text: string,
  documentType: string
): Promise<ExtractedVendorData> {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",

    contents: `
${extractionInstruction}

Document type:
${documentType}

Document text:
${text}
`,

    config: {
      responseMimeType: "application/json",
    },
  });

  const content = response.text;

  if (!content) {
    throw new Error("Gemini returned an empty response");
  }

  return parseAIResponse(content);
}

export async function extractVendorDataFromImage(
  filePath: string,
  documentType: string
): Promise<ExtractedVendorData> {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const imageBuffer = await fs.readFile(filePath);

  const base64Image = imageBuffer.toString("base64");

  const extension = filePath.toLowerCase().endsWith(".png")
    ? "image/png"
    : "image/jpeg";

  const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",

    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
${extractionInstruction}

Document type:
${documentType}

Extract the vendor information from this document image.
`,
          },
          {
            inlineData: {
              mimeType: extension,
              data: base64Image,
            },
          },
        ],
      },
    ],

    config: {
      responseMimeType: "application/json",
    },
  });

  const content = response.text;

  if (!content) {
    throw new Error("Gemini returned an empty response");
  }

  return parseAIResponse(content);
}