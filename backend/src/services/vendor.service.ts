// import { Vendor, VendorStatus } from "../models/Vendor.model.js";

// export interface CreateVendorInput {
//   companyName: string;
//   contactPerson: string;
//   email: string;
//   phone: string;
//   address: string;
//   registrationNumber: string;
//   gstNumber: string;
//   bankAccountNumber: string;
//   ifscCode: string;
// }

// export interface UpdateVendorInput {
//   companyName?: string;
//   contactPerson?: string;
//   email?: string;
//   phone?: string;
//   address?: string;
//   registrationNumber?: string;
//   gstNumber?: string;
//   bankAccountNumber?: string;
//   ifscCode?: string;
//   workflowStatus?: VendorStatus;
// }

// export async function createVendor(input: CreateVendorInput) {
//   return Vendor.create(input);
// }

// export async function getVendors() {
//   return Vendor.find().sort({ createdAt: -1 });
// }

// export async function getVendorById(id: string) {
//   return Vendor.findById(id);
// }

// export async function updateVendor(
//   id: string,
//   input: UpdateVendorInput
// ) {
//   return Vendor.findByIdAndUpdate(
//     id,
//     input,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
// }

// export async function deleteVendor(id: string) {
//   return Vendor.findByIdAndDelete(id);
// }

// export async function updateVendorStatus(
//   id: string,
//   status: VendorStatus
// ) {
//   return Vendor.findByIdAndUpdate(
//     id,
//     {
//       workflowStatus: status,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
// }

import { Vendor, VendorStatus } from "../models/Vendor.model.js";
import { VendorVersion } from "../models/VendorVersion.model.js";

export interface CreateVendorInput {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  gstNumber: string;
  bankAccountNumber: string;
  ifscCode: string;
}

export interface UpdateVendorInput {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  registrationNumber?: string;
  gstNumber?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  workflowStatus?: VendorStatus;
}

export async function createVendor(input: CreateVendorInput) {
  return Vendor.create(input);
}

export async function getVendors() {
  return Vendor.find().sort({ createdAt: -1 });
}

export async function getVendorById(id: string) {
  return Vendor.findById(id);
}

export async function updateVendor(
  id: string,
  input: UpdateVendorInput
) {
  const existingVendor = await Vendor.findById(id);

  if (!existingVendor) {
    return null;
  }

  // Save current state before updating
  const latestVersion = await VendorVersion.findOne({
    vendorId: existingVendor._id,
  }).sort({ version: -1 });

  const nextVersion = latestVersion
    ? latestVersion.version + 1
    : 1;

  await VendorVersion.create({
    vendorId: existingVendor._id,
    version: nextVersion,
    data: {
      companyName: existingVendor.companyName,
      contactPerson: existingVendor.contactPerson,
      email: existingVendor.email,
      phone: existingVendor.phone,
      address: existingVendor.address,
      registrationNumber: existingVendor.registrationNumber,
      gstNumber: existingVendor.gstNumber,
      bankAccountNumber: existingVendor.bankAccountNumber,
      ifscCode: existingVendor.ifscCode,
      workflowStatus: existingVendor.workflowStatus,
    },
  });

  return Vendor.findByIdAndUpdate(
    id,
    input,
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function deleteVendor(id: string) {
  return Vendor.findByIdAndDelete(id);
}

export async function updateVendorStatus(
  id: string,
  status: VendorStatus
) {
  return Vendor.findByIdAndUpdate(
    id,
    { workflowStatus: status },
    {
      new: true,
      runValidators: true,
    }
  );
}