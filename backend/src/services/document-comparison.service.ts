// import { VendorDocument } from "../models/Document.model.js";
// import { Vendor } from "../models/Vendor.model.js";
// import { VendorStatus } from "../models/Vendor.model.js";

// type ComparisonStatus = "MATCHED" | "MISMATCH" | "MISSING";

// interface FieldComparison {
//   status: ComparisonStatus;
//   vendorValue: string;
//   documentValues: string[];
//   sources: string[];
// }

// interface ComparisonResult {
//   overallStatus: ComparisonStatus;
//   fields: Record<string, FieldComparison>;
//   missingDocuments: string[];
//   mismatches: string[];
// }

// const fields = [
//   "companyName",
//   "registrationNumber",
//   "gstNumber",
//   "address",
//   "bankAccountNumber",
//   "ifscCode",
// ] as const;

// const requiredDocuments = ["registration", "gst", "bank"];

// function normalize(value?: string): string {
//   return (value || "")
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, " ");
// }

// function compareValues(values: string[]): boolean {
//   const normalizedValues = values
//     .filter(Boolean)
//     .map(normalize);

//   if (normalizedValues.length <= 1) {
//     return true;
//   }

//   return normalizedValues.every(
//     (value) => value === normalizedValues[0]
//   );
// }

// export async function compareVendorDocuments(
//   vendorId: string
// ): Promise<ComparisonResult> {
//   const vendor = await Vendor.findById(vendorId);

//   if (!vendor) {
//     throw new Error("Vendor not found");
//   }

//   const documents = await VendorDocument.find({
//     vendorId,
//     status: "processed",
//   }).sort({ createdAt: -1 });

//   const missingDocuments = requiredDocuments.filter(
//     (type) => !documents.some((document) => document.type === type)
//   );

//   const result: ComparisonResult = {
//     overallStatus: "MATCHED",
//     fields: {},
//     missingDocuments,
//     mismatches: [],
//   };

//   for (const field of fields) {
//     const vendorValue = String(vendor[field] || "");

//     const documentValues: string[] = [];
//     const sources: string[] = [];

//     for (const document of documents) {
//       const value = document.extractedData?.[field];

//       if (value) {
//         documentValues.push(value);
//         sources.push(document.type);
//       }
//     }

//     /*
//      * No document contains this field.
//      */
//     if (documentValues.length === 0) {
//       result.fields[field] = {
//         status: "MISSING",
//         vendorValue,
//         documentValues: [],
//         sources: [],
//       };

//       continue;
//     }

//     /*
//      * Compare all available document values.
//      */
//     const documentsMatch = compareValues(documentValues);

//     /*
//      * Compare documents against vendor master data.
//      */
//     const vendorMatches = documentValues.every(
//       (value) => normalize(value) === normalize(vendorValue)
//     );

//     if (documentsMatch && vendorMatches) {
//       result.fields[field] = {
//         status: "MATCHED",
//         vendorValue,
//         documentValues,
//         sources,
//       };
//     } else {
//       result.fields[field] = {
//         status: "MISMATCH",
//         vendorValue,
//         documentValues,
//         sources,
//       };

//       result.mismatches.push(field);
//     }
//   }

//   if (missingDocuments.length > 0) {
//   result.overallStatus = "MISSING";
// }

// if (result.mismatches.length > 0) {
//   result.overallStatus = "MISMATCH";
// }

// if (
//   result.overallStatus === "MISMATCH" ||
//   result.overallStatus === "MISSING"
// ) {
//   await Vendor.findByIdAndUpdate(vendorId, {
//     workflowStatus: "Action Required",
//   });
// }

// return result;
// }


import { VendorDocument } from "../models/Document.model.js";
import { Vendor } from "../models/Vendor.model.js";

type ComparisonStatus = "MATCHED" | "MISMATCH" | "MISSING";

interface FieldComparison {
  status: ComparisonStatus;
  vendorValue: string;
  documentValues: string[];
  sources: string[];
}

interface ComparisonResult {
  overallStatus: ComparisonStatus;
  fields: Record<string, FieldComparison>;
  missingDocuments: string[];
  mismatches: string[];
}

const fields = [
  "companyName",
  "registrationNumber",
  "gstNumber",
  "address",
  "bankAccountNumber",
  "ifscCode",
] as const;

const requiredDocuments = [
  "registration",
  "gst",
  "bank",
];

function normalize(value?: string): string {
  return (value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function compareValues(values: string[]): boolean {
  const normalizedValues = values
    .filter(Boolean)
    .map(normalize);

  if (normalizedValues.length <= 1) {
    return true;
  }

  return normalizedValues.every(
    (value) => value === normalizedValues[0]
  );
}

export async function compareVendorDocuments(
  vendorId: string
): Promise<ComparisonResult> {
  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  /*
   * Get ALL documents for this vendor.
   *
   * We use all documents to determine whether a required
   * document has been uploaded.
   */
  const allDocuments = await VendorDocument.find({
    vendorId,
  }).sort({
    createdAt: -1,
  });

  /*
   * A document is missing only when there is no uploaded
   * document of that type.
   */
  const missingDocuments = requiredDocuments.filter(
    (type) =>
      !allDocuments.some(
        (document) => document.type === type
      )
  );

  /*
   * Only processed documents can participate in
   * extracted-data comparison.
   */
  const processedDocuments = allDocuments.filter(
    (document) => document.status === "processed"
  );

  const result: ComparisonResult = {
    overallStatus: "MATCHED",
    fields: {},
    missingDocuments,
    mismatches: [],
  };

  /*
   * Compare extracted document data with vendor data.
   */
  for (const field of fields) {
    const vendorValue = String(vendor[field] || "");

    const documentValues: string[] = [];
    const sources: string[] = [];

    for (const document of processedDocuments) {
      const value = document.extractedData?.[field];

      if (value) {
        documentValues.push(String(value));
        sources.push(document.type);
      }
    }

    /*
     * No processed document contains this field.
     */
    if (documentValues.length === 0) {
      result.fields[field] = {
        status: "MISSING",
        vendorValue,
        documentValues: [],
        sources: [],
      };

      continue;
    }

    /*
     * Compare values between documents.
     */
    const documentsMatch =
      compareValues(documentValues);

    /*
     * Compare document values against vendor master data.
     */
    const vendorMatches = documentValues.every(
      (value) =>
        normalize(value) === normalize(vendorValue)
    );

    if (documentsMatch && vendorMatches) {
      result.fields[field] = {
        status: "MATCHED",
        vendorValue,
        documentValues,
        sources,
      };
    } else {
      result.fields[field] = {
        status: "MISMATCH",
        vendorValue,
        documentValues,
        sources,
      };

      result.mismatches.push(field);
    }
  }

  /*
   * Overall status.
   */
  if (missingDocuments.length > 0) {
    result.overallStatus = "MISSING";
  }

  if (result.mismatches.length > 0) {
    result.overallStatus = "MISMATCH";
  }

  /*
   * Update vendor workflow status when action is required.
   */
  if (
    result.overallStatus === "MISMATCH" ||
    result.overallStatus === "MISSING"
  ) {
    await Vendor.findByIdAndUpdate(vendorId, {
      workflowStatus: "Action Required",
    });
  }

  return result;
}

