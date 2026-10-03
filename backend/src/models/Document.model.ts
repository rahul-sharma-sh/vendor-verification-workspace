// import mongoose, { Document, Schema, Types } from "mongoose";

// export type DocumentType =
//   | "registration"
//   | "gst"
//   | "bank";

// export type DocumentStatus =
//   | "uploaded"
//   | "processing"
//   | "processed"
//   | "failed";

// export interface IDocument extends Document {
//   vendorId: Types.ObjectId;

//   type: DocumentType;

//   originalName: string;
//   fileName: string;
//   filePath: string;
//   mimeType: string;
//   fileSize: number;

//   status: DocumentStatus;

//   extractedData?: {
//     companyName?: string;
//     registrationNumber?: string;
//     gstNumber?: string;
//     address?: string;
//     bankAccountNumber?: string;
//     ifscCode?: string;
//   };

//   createdAt: Date;
//   updatedAt: Date;
// }

// const documentSchema = new Schema<IDocument>(
//   {
//     vendorId: {
//       type: Schema.Types.ObjectId,
//       ref: "Vendor",
//       required: true,
//       index: true,
//     },

//     type: {
//       type: String,
//       enum: ["registration", "gst", "bank"],
//       required: true,
//     },

//     originalName: {
//       type: String,
//       required: true,
//     },

//     fileName: {
//       type: String,
//       required: true,
//     },

//     filePath: {
//       type: String,
//       required: true,
//     },

//     mimeType: {
//       type: String,
//       required: true,
//     },

//     fileSize: {
//       type: Number,
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: [
//         "uploaded",
//         "processing",
//         "processed",
//         "failed",
//       ],
//       default: "uploaded",
//     },

//     extractedData: {
//       companyName: String,
//       registrationNumber: String,
//       gstNumber: String,
//       address: String,
//       bankAccountNumber: String,
//       ifscCode: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const VendorDocument =
//   mongoose.model<IDocument>(
//     "VendorDocument",
//     documentSchema
//   );





import mongoose, { Document, Schema, Types } from "mongoose";

export type DocumentType =
  | "registration"
  | "gst"
  | "bank";

export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "processed"
  | "failed";

export interface ExtractedData {
  companyName?: string;
  registrationNumber?: string;
  gstNumber?: string;
  address?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
}

export interface IDocument extends Document {
  vendorId: Types.ObjectId;

  type: DocumentType;

  originalName: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;

  status: DocumentStatus;

  extractedData?: ExtractedData;

  extractionError?: string;

  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["registration", "gst", "bank"],
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "uploaded",
        "processing",
        "processed",
        "failed",
      ],
      default: "uploaded",
    },

    extractedData: {
      companyName: String,
      registrationNumber: String,
      gstNumber: String,
      address: String,
      bankAccountNumber: String,
      ifscCode: String,
    },

    extractionError: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const VendorDocument =
  mongoose.model<IDocument>(
    "VendorDocument",
    documentSchema
  );