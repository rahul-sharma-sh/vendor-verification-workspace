import { Request, Response } from "express";
import {
  getVendorVersions,
  restoreVendorVersion,
} from "../services/vendor-version.service.js";

export async function getVendorVersionsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const vendorId = String(req.params.id);

    const versions = await getVendorVersions(vendorId);

    res.status(200).json({
      success: true,
      data: versions,
    });
  } catch (error) {
    console.error("Get vendor versions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vendor versions",
    });
  }
}

export async function restoreVendorVersionController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const vendorId = String(req.params.id);
    const versionId = String(req.params.versionId);

    const vendor = await restoreVendorVersion(
      vendorId,
      versionId
    );

    res.status(200).json({
      success: true,
      message: "Vendor version restored successfully",
      data: vendor,
    });
  } catch (error) {
    console.error("Restore vendor version error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to restore vendor version";

    const statusCode =
      message === "Vendor not found" ||
      message === "Vendor version not found"
        ? 404
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
}