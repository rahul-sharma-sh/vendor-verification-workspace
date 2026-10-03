import { api } from "./axios";

export interface Vendor {
  _id: string;
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
  openCorporatesVerification?: {
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorPayload {
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

export interface UpdateVendorPayload {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  registrationNumber?: string;
  gstNumber?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  workflowStatus?: string;
}

export const getVendors = async (params?: {
  search?: string;
  status?: string;
}) => {
  const response = await api.get("/vendors", {
    params,
  });

  return response.data;
};

export const getVendorById = async (id: string) => {
  const response = await api.get(`/vendors/${id}`);

  return response.data;
};

export const createVendor = async (payload: CreateVendorPayload) => {
  const response = await api.post("/vendors", payload);

  return response.data;
};

export const updateVendor = async (
  id: string,
  payload: UpdateVendorPayload,
) => {
  const response = await api.patch(`/vendors/${id}`, payload);

  return response.data;
};

export const deleteVendor = async (id: string) => {
  const response = await api.delete(`/vendors/${id}`);

  return response.data;
};

export const sendMissingDocumentsEmail = async (vendorId: string) => {
  const response = await api.post(
    `/vendors/${vendorId}/missing-documents/email`
  );

  return response.data;
};