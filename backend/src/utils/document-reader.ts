import fs from "fs/promises";
import path from "path";
import { PDFParse } from "pdf-parse";

export async function readPdfText(
  filePath: string
): Promise<string> {
  const buffer = await fs.readFile(filePath);

  const parser = new PDFParse({
    data: buffer,
  });

  const result = await parser.getText();

  await parser.destroy();

  return result.text;
}

export async function readImageAsBase64(
  filePath: string
): Promise<string> {
  const buffer = await fs.readFile(filePath);

  return buffer.toString("base64");
}

export function getMimeType(
  filePath: string
): string {
  const extension = path
    .extname(filePath)
    .toLowerCase();

  if (extension === ".png") {
    return "image/png";
  }

  if (
    extension === ".jpg" ||
    extension === ".jpeg"
  ) {
    return "image/jpeg";
  }

  if (extension === ".pdf") {
    return "application/pdf";
  }

  throw new Error(
    `Unsupported file extension: ${extension}`
  );
}