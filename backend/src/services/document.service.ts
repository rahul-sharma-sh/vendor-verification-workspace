import { VendorDocument } from "../models/Document.model.js";

import {
  extractVendorDataFromImage,
  extractVendorDataFromText,
} from "./ai.service.js";

import { readPdfText } from "../utils/document-reader.js";

interface CreateDocumentInput {
  vendorId: string;
  type: "registration" | "gst" | "bank";
  originalName: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
}

export async function createDocument(
  input: CreateDocumentInput
) {
  const document = await VendorDocument.create({
    ...input,
    status: "uploaded",
  });

  return document;
}

export async function getVendorDocuments(
  vendorId: string
) {
  return VendorDocument.find({
    vendorId,
  }).sort({
    createdAt: -1,
  });
}

export async function getDocumentById(
  documentId: string
) {
  return VendorDocument.findById(documentId);
}

export async function extractDocumentData(
  documentId: string
) {
  const document =
    await VendorDocument.findById(documentId);

  if (!document) {
    throw new Error("Document not found");
  }

  await VendorDocument.findByIdAndUpdate(
    documentId,
    {
      status: "processing",
      extractionError: undefined,
    }
  );

  try {
    let extractedData;

    if (document.mimeType === "application/pdf") {
      const text = await readPdfText(
        document.filePath
      );

      if (!text.trim()) {
        throw new Error(
          "No readable text found in PDF"
        );
      }

      extractedData =
        await extractVendorDataFromText(
          text,
          document.type
        );
    } else {
      extractedData =
        await extractVendorDataFromImage(
          document.filePath,
          document.type
        );
    }

    const updatedDocument =
      await VendorDocument.findByIdAndUpdate(
        documentId,
        {
          status: "processed",
          extractedData,
          $unset: {
            extractionError: 1,
          },
        },
        {
          new: true,
        }
      );

    return updatedDocument;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Document extraction failed";

    await VendorDocument.findByIdAndUpdate(
      documentId,
      {
        status: "failed",
        extractionError: message,
      }
    );

    throw error;
  }
}