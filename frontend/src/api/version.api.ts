import { api } from "./axios";

export interface VendorVersionData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  gstNumber: string;
  bankAccountNumber: string;
  ifscCode: string;
  workflowStatus: string;
}

export interface VendorVersion {
  _id: string;
  vendorId: string;
  version: number;
  data: VendorVersionData;
  createdAt: string;
}

export const getVendorVersions = async (vendorId: string) => {
  const response = await api.get(`/vendors/${vendorId}/versions`);
  return response.data;
};

export const restoreVendorVersion = async (
  vendorId: string,
  versionId: string,
) => {
  const response = await api.post(
    `/vendors/${vendorId}/versions/${versionId}/restore`,
  );

  return response.data;
};