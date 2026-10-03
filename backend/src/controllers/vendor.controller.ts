import { Request, Response } from "express";

import {
  createVendor,
  deleteVendor,
  getVendorById,
  getVendors,
  updateVendor,
  updateVendorStatus 
} from "../services/vendor.service.js";

import {
  verifyVendorWithOpenCorporates,
} from "../services/opencorporates.service.js";

import { sendMissingDocumentEmail } from "../services/email.service.js";
import { compareVendorDocuments } from "../services/document-comparison.service.js";
import { Vendor } from "../models/Vendor.model.js";

export async function createVendorController(
  req: Request,
  res: Response
) {
  try {
    const vendor = await createVendor(req.body);

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      data: vendor,
    });
  } catch (error) {
    console.error("Create vendor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create vendor",
    });
  }
}

export async function getVendorsController(
  _req: Request,
  res: Response
) {
  try {
    const vendors = await getVendors();

    return res.status(200).json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    console.error("Get vendors error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendors",
    });
  }
}

export async function getVendorByIdController(
  req: Request,
  res: Response
) {
  try {
    const vendorId = String(req.params.id);

    const vendor = await getVendorById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    console.error("Get vendor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor",
    });
  }
}

export async function updateVendorController(
  req: Request,
  res: Response
) {
  try {
    const vendorId = String(req.params.id);

    const vendor = await updateVendor(
      vendorId,
      req.body
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: vendor,
    });
  } catch (error) {
    console.error("Update vendor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update vendor",
    });
  }
}

export async function deleteVendorController(
  req: Request,
  res: Response
) {
  try {
    const vendorId = String(req.params.id);

    const vendor = await deleteVendor(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    console.error("Delete vendor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete vendor",
    });
  }
}

export async function updateVendorStatusController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const vendorId = String(req.params.id);

    const allowedStatuses = [
      "Draft",
      "Under Review",
      "Action Required",
      "Approved",
      "Rejected",
    ];

    const { workflowStatus } = req.body;

    if (!allowedStatuses.includes(workflowStatus)) {
      res.status(400).json({
        success: false,
        message: "Invalid workflow status",
      });

      return;
    }

    const vendor = await updateVendorStatus(
      vendorId,
      workflowStatus
    );

    if (!vendor) {
      res.status(404).json({
        success: false,
        message: "Vendor not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Vendor workflow status updated successfully",
      data: vendor,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update workflow status";

    res.status(500).json({
      success: false,
      message,
    });
  }
}

export async function verifyVendorWithOpenCorporatesController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const vendorId = String(req.params.id);

    const vendor =
      await verifyVendorWithOpenCorporates(vendorId);

    res.status(200).json({
      success: true,
      message:
        "Vendor OpenCorporates verification completed",
      data: vendor,
    });
  } catch (error) {
    console.error(
      "Vendor OpenCorporates verification controller error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "OpenCorporates verification failed";

    if (message === "Vendor not found") {
      res.status(404).json({
        success: false,
        message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message,
    });
  }
}

export async function sendMissingDocumentEmailController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const vendorId = String(req.params.id);

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      res.status(404).json({
        success: false,
        message: "Vendor not found",
      });

      return;
    }

    const comparison = await compareVendorDocuments(vendorId);

    if (comparison.missingDocuments.length === 0) {
      res.status(400).json({
        success: false,
        message: "No missing documents found",
      });

      return;
    }

    const emailResult = await sendMissingDocumentEmail(
      vendor.email,
      vendor.companyName,
      comparison.missingDocuments
    );

    res.status(200).json({
      success: true,
      message: "Missing document email sent successfully",
      data: {
        vendorId: vendor._id,
        vendorEmail: vendor.email,
        missingDocuments: comparison.missingDocuments,
        email: emailResult,
      },
    });
  } catch (error) {
    console.error(
      "Send missing document email error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to send missing document email";

    res.status(500).json({
      success: false,
      message,
    });
  }
}