import { Request, Response } from "express";

import {
  createDocument,
  extractDocumentData,
  getDocumentById,
  getVendorDocuments,
} from "../services/document.service.js";

import { compareVendorDocuments } from "../services/document-comparison.service.js";

export async function uploadDocumentController(
  req: Request,
  res: Response
) {
  try {
    const { vendorId, type } = req.body;

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: "vendorId is required",
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Document type is required",
      });
    }

    if (!["registration", "gst", "bank"].includes(type)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid document type. Use registration, gst or bank",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }

    const document = await createDocument({
      vendorId,
      type,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error) {
    console.error(
      "Upload document error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to upload document",
    });
  }
}

export async function getVendorDocumentsController(
  req: Request,
  res: Response
) {
  try {
    const vendorId = String(req.params.vendorId);

    const documents =
      await getVendorDocuments(vendorId);

    return res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error(
      "Get vendor documents error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
}

export async function getDocumentController(
  req: Request,
  res: Response
) {
  try {
    const documentId = String(req.params.id);

    const document =
      await getDocumentById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error(
      "Get document error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch document",
    });
  }
}

export async function extractDocumentController(
  req: Request,
  res: Response
) {
  try {
    const documentId = String(req.params.id);

    const document =
      await extractDocumentData(documentId);

    return res.status(200).json({
      success: true,
      message:
        "Document processed successfully",
      data: document,
    });
  } catch (error) {
    console.error(
      "Document extraction error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Document extraction failed",
    });
  }
}

export async function compareVendorDocumentsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const vendorId = String(req.params.vendorId);

    const result = await compareVendorDocuments(vendorId);

    res.status(200).json({
      success: true,
      message: "Vendor documents compared successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to compare vendor documents";

    res.status(500).json({
      success: false,
      message,
    });
  }
}