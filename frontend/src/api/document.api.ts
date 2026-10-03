import { api } from "./axios";

export type DocumentType = "registration" | "gst" | "bank";

export interface ExtractedData {
  companyName?: string;
  registrationNumber?: string;
  gstNumber?: string;
  address?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  [key: string]: unknown;
}

export interface VendorDocument {
  _id: string;
  vendorId: string;
  type: DocumentType;
  status: string;

  originalName?: string;
  fileName?: string;
  filePath?: string;
  mimeType?: string;
  fileSize?: number;

  extractedData?: ExtractedData;
  extractionError?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ComparisonField {
  status: "MATCHED" | "MATCH" | "MISMATCH" | "MISSING";
  vendorValue: string;
  documentValues: string[];
  sources?: string[];
}

export interface DocumentComparison {
  overallStatus: "MATCHED" | "MATCH" | "MISMATCH" | "MISSING";
  fields: Record<string, ComparisonField>;
  missingDocuments: string[];
  mismatches: string[];
}

export const uploadDocument = async (
  vendorId: string,
  type: DocumentType,
  file: File,
) => {
  const formData = new FormData();

  formData.append("vendorId", vendorId);
  formData.append("type", type);
  formData.append("document", file, file.name);

  const response = await api.post(
    "/documents/upload",
    formData,
  );

  return response.data;
};

export const getVendorDocuments = async (
  vendorId: string,
) => {
  const response = await api.get(
    `/documents/vendor/${vendorId}`,
  );

  return response.data;
};

export const getDocumentById = async (
  documentId: string,
) => {
  const response = await api.get(
    `/documents/${documentId}`,
  );

  return response.data;
};

export const extractDocument = async (
  documentId: string,
) => {
  const response = await api.post(
    `/documents/${documentId}/extract`,
  );

  return response.data;
};

export const compareVendorDocuments = async (
  vendorId: string,
) => {
  const response = await api.get(
    `/documents/vendor/${vendorId}/comparison`,
  );

  return response.data;
};