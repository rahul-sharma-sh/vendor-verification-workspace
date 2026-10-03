// import mongoose, { Document, Schema } from "mongoose";

// export type VendorStatus =
//   | "Draft"
//   | "Under Review"
//   | "Action Required"
//   | "Approved"
//   | "Rejected";

// export interface IVendor extends Document {
//   companyName: string;
//   contactPerson: string;
//   email: string;
//   phone: string;
//   address: string;
//   registrationNumber: string;
//   gstNumber: string;
//   bankAccountNumber: string;
//   ifscCode: string;

//   workflowStatus: VendorStatus;

//   createdAt: Date;
//   updatedAt: Date;
// }

// const vendorSchema = new Schema<IVendor>(
//   {
//     companyName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     contactPerson: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },

//     phone: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     address: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     registrationNumber: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     gstNumber: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     bankAccountNumber: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     ifscCode: {
//       type: String,
//       required: true,
//       trim: true,
//       uppercase: true,
//     },

//     workflowStatus: {
//       type: String,
//       enum: [
//         "Draft",
//         "Under Review",
//         "Action Required",
//         "Approved",
//         "Rejected",
//       ],
//       default: "Draft",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const Vendor = mongoose.model<IVendor>(
//   "Vendor",
//   vendorSchema
// );



import mongoose, { Document, Schema } from "mongoose";

export type VendorStatus =
  | "Draft"
  | "Under Review"
  | "Action Required"
  | "Approved"
  | "Rejected";

export type OpenCorporatesVerificationStatus =
  | "Pending"
  | "Verified"
  | "Not Found"
  | "Failed";

export interface IVendor extends Document {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  gstNumber: string;
  bankAccountNumber: string;
  ifscCode: string;

  workflowStatus: VendorStatus;

  openCorporatesVerification: {
    status: OpenCorporatesVerificationStatus;
    companyNumber?: string;
    jurisdictionCode?: string;
    matchedCompanyName?: string;
    openCorporatesUrl?: string;
    currentStatus?: string;
    verifiedAt?: Date;
    message?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<IVendor>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      trim: true,
    },

    gstNumber: {
      type: String,
      required: true,
      trim: true,
    },

    bankAccountNumber: {
      type: String,
      required: true,
      trim: true,
    },

    ifscCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    workflowStatus: {
      type: String,
      enum: [
        "Draft",
        "Under Review",
        "Action Required",
        "Approved",
        "Rejected",
      ],
      default: "Draft",
    },

    openCorporatesVerification: {
      status: {
        type: String,
        enum: [
          "Pending",
          "Verified",
          "Not Found",
          "Failed",
        ],
        default: "Pending",
      },

      companyNumber: {
        type: String,
      },

      jurisdictionCode: {
        type: String,
      },

      matchedCompanyName: {
        type: String,
      },

      openCorporatesUrl: {
        type: String,
      },

      currentStatus: {
        type: String,
      },

      verifiedAt: {
        type: Date,
      },

      message: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Vendor = mongoose.model<IVendor>(
  "Vendor",
  vendorSchema
);