import mongoose, { Document, Schema } from "mongoose";

export interface IVendorVersion extends Document {
  vendorId: mongoose.Types.ObjectId;

  version: number;

  data: {
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
  };

  createdAt: Date;
}

const vendorVersionSchema = new Schema<IVendorVersion>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    version: {
      type: Number,
      required: true,
    },

    data: {
      companyName: { type: String, required: true },
      contactPerson: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      registrationNumber: { type: String, required: true },
      gstNumber: { type: String, required: true },
      bankAccountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      workflowStatus: { type: String, required: true },
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

vendorVersionSchema.index(
  { vendorId: 1, version: 1 },
  { unique: true }
);

export const VendorVersion = mongoose.model<IVendorVersion>(
  "VendorVersion",
  vendorVersionSchema
);