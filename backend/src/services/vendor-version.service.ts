import { Vendor } from "../models/Vendor.model.js";
import { VendorVersion } from "../models/VendorVersion.model.js";

export async function getVendorVersions(vendorId: string) {
  return VendorVersion.find({
    vendorId,
  }).sort({
    version: -1,
  });
}

export async function restoreVendorVersion(
  vendorId: string,
  versionId: string
) {
  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  const version = await VendorVersion.findOne({
    _id: versionId,
    vendorId,
  });

  if (!version) {
    throw new Error("Vendor version not found");
  }

  // Save current state before restoring
  const latestVersion = await VendorVersion.findOne({
    vendorId,
  }).sort({
    version: -1,
  });

  const nextVersion = latestVersion
    ? latestVersion.version + 1
    : 1;

  await VendorVersion.create({
    vendorId,
    version: nextVersion,
    data: {
      companyName: vendor.companyName,
      contactPerson: vendor.contactPerson,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      registrationNumber: vendor.registrationNumber,
      gstNumber: vendor.gstNumber,
      bankAccountNumber: vendor.bankAccountNumber,
      ifscCode: vendor.ifscCode,
      workflowStatus: vendor.workflowStatus,
    },
  });

  return Vendor.findByIdAndUpdate(
    vendorId,
    {
      companyName: version.data.companyName,
      contactPerson: version.data.contactPerson,
      email: version.data.email,
      phone: version.data.phone,
      address: version.data.address,
      registrationNumber: version.data.registrationNumber,
      gstNumber: version.data.gstNumber,
      bankAccountNumber: version.data.bankAccountNumber,
      ifscCode: version.data.ifscCode,
      workflowStatus: version.data.workflowStatus,
    },
    {
      new: true,
      runValidators: true,
    }
  );
}