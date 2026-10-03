// import { useEffect, useState } from "react";

// import {
//   compareVendorDocuments,
//   extractDocument,
//   getVendorDocuments,
//   uploadDocument,
//   type DocumentComparison,
//   type DocumentType,
//   type VendorDocument,
// } from "../../api/document.api";

// interface VendorDocumentsProps {
//   vendorId: string;
// }

// const documentLabels: Record<DocumentType, string> = {
//   registration: "Registration Certificate",
//   gst: "GST Certificate",
//   bank: "Bank Document",
// };

// const documentTypes: DocumentType[] = [
//   "registration",
//   "gst",
//   "bank",
// ];

// const fieldLabels: Record<string, string> = {
//   companyName: "Company Name",
//   registrationNumber: "Registration Number",
//   gstNumber: "GST Number",
//   address: "Address",
//   bankAccountNumber: "Bank Account Number",
//   ifscCode: "IFSC Code",
// };

// const sourceLabels: Record<string, string> = {
//   registration: "Registration",
//   gst: "GST",
//   bank: "Bank",
// };

// const getStatusClasses = (status?: string) => {
//   switch (status?.toLowerCase()) {
//     case "match":
//     case "verified":
//     case "processed":
//     case "extracted":
//       return "bg-green-100 text-green-700";

//     case "mismatch":
//     case "failed":
//     case "rejected":
//       return "bg-red-100 text-red-700";

//     case "processing":
//     case "pending":
//       return "bg-yellow-100 text-yellow-700";

//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// };

// export default function VendorDocuments({
//   vendorId,
// }: VendorDocumentsProps) {
//   const [documents, setDocuments] = useState<VendorDocument[]>([]);
//   const [comparison, setComparison] =
//     useState<DocumentComparison | null>(null);

//   const [loading, setLoading] = useState(true);
//   const [comparisonLoading, setComparisonLoading] =
//     useState(false);

//   const [uploading, setUploading] =
//     useState<DocumentType | null>(null);

//   const [extracting, setExtracting] =
//     useState<string | null>(null);

//   const loadDocuments = async () => {
//     try {
//       setLoading(true);

//       const response = await getVendorDocuments(vendorId);

//       setDocuments(response?.data || []);
//     } catch (error) {
//       console.error("Failed to load documents:", error);
//       setDocuments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDocuments();
//   }, [vendorId]);

//   const getDocumentByType = (type: DocumentType) => {
//     return documents.find(
//       (document) => document.type === type,
//     );
//   };

//   const handleFileUpload = async (
//     type: DocumentType,
//     file: File,
//   ) => {
//     try {
//       setUploading(type);

//       await uploadDocument(
//         vendorId,
//         type,
//         file,
//       );

//       await loadDocuments();

//       // Refresh comparison after upload
//       try {
//         const comparisonResponse =
//           await compareVendorDocuments(vendorId);

//         setComparison(
//           comparisonResponse?.data || null,
//         );
//       } catch {
//         // Comparison may fail if required documents are incomplete.
//       }
//     } catch (error) {
//       console.error("Document upload failed:", error);

//       alert("Document upload failed");
//     } finally {
//       setUploading(null);
//     }
//   };

//   const handleExtract = async (
//     documentId: string,
//   ) => {
//     try {
//       setExtracting(documentId);

//       await extractDocument(documentId);

//       await loadDocuments();

//       // Refresh comparison after extraction
//       try {
//         const comparisonResponse =
//           await compareVendorDocuments(vendorId);

//         setComparison(
//           comparisonResponse?.data || null,
//         );
//       } catch {
//         // Ignore comparison refresh failure.
//       }
//     } catch (error) {
//       console.error(
//         "Document extraction failed:",
//         error,
//       );

//       alert("Document extraction failed");
//     } finally {
//       setExtracting(null);
//     }
//   };

//   const handleCompare = async () => {
//     try {
//       setComparisonLoading(true);

//       const response =
//         await compareVendorDocuments(vendorId);

//       setComparison(response?.data || null);
//     } catch (error) {
//       console.error(
//         "Document comparison failed:",
//         error,
//       );

//       alert("Document comparison failed");
//     } finally {
//       setComparisonLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Documents Header */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="text-lg font-semibold text-gray-900">
//             Vendor Documents
//           </h2>

//           <p className="mt-1 text-sm text-gray-500">
//             Upload, process and verify vendor documents.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={handleCompare}
//           disabled={comparisonLoading}
//           className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           {comparisonLoading
//             ? "Comparing..."
//             : "Compare Documents"}
//         </button>
//       </div>

//       {/* Documents */}
//       {loading ? (
//         <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
//           Loading documents...
//         </div>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-3">
//           {documentTypes.map((type) => {
//             const document =
//               getDocumentByType(type);

//             return (
//               <DocumentCard
//                 key={type}
//                 type={type}
//                 document={document}
//                 uploading={uploading === type}
//                 extracting={
//                   extracting === document?._id
//                 }
//                 onUpload={handleFileUpload}
//                 onExtract={handleExtract}
//               />
//             );
//           })}
//         </div>
//       )}

//       {/* Comparison Result */}
//       {comparison && (
//         <ComparisonResult
//           comparison={comparison}
//         />
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    DOCUMENT CARD
// ========================================================= */

// interface DocumentCardProps {
//   type: DocumentType;
//   document?: VendorDocument;
//   uploading: boolean;
//   extracting: boolean;
//   onUpload: (
//     type: DocumentType,
//     file: File,
//   ) => void;
//   onExtract: (documentId: string) => void;
// }

// function DocumentCard({
//   type,
//   document,
//   uploading,
//   extracting,
//   onUpload,
//   onExtract,
// }: DocumentCardProps) {
//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//       {/* Header */}
//       <div className="mb-4 flex items-start justify-between gap-3">
//         <div>
//           <h3 className="font-semibold text-gray-900">
//             {documentLabels[type]}
//           </h3>

//           <p className="mt-1 text-xs text-gray-500">
//             Type: {type}
//           </p>
//         </div>

//         {document && (
//           <span
//             className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
//               document.status,
//             )}`}
//           >
//             {document.status}
//           </span>
//         )}
//       </div>

//       {document ? (
//         <div className="space-y-4">
//           {/* File */}
//           <div className="rounded-lg bg-gray-50 p-3">
//             <p className="text-xs text-gray-500">
//               File
//             </p>

//             <p className="mt-1 truncate text-sm font-medium text-gray-800">
//               {document.originalName ||
//                 document.fileName ||
//                 "Uploaded document"}
//             </p>
//           </div>

//           {/* Extracted Data */}
//           {document.extractedData &&
//             Object.keys(
//               document.extractedData,
//             ).length > 0 && (
//               <div className="rounded-lg border border-gray-100 p-3">
//                 <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                   Extracted Data
//                 </p>

//                 <div className="space-y-2">
//                   {Object.entries(
//                     document.extractedData,
//                   ).map(([key, value]) => (
//                     <div
//                       key={key}
//                       className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
//                     >
//                       <p className="text-xs text-gray-500">
//                         {fieldLabels[key] || key}
//                       </p>

//                       <p className="mt-0.5 break-words text-xs font-medium text-gray-800">
//                         {value
//                           ? String(value)
//                           : "—"}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//           {/* Extract */}
//           <button
//             type="button"
//             onClick={() =>
//               onExtract(document._id)
//             }
//             disabled={extracting}
//             className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {extracting
//               ? "Processing..."
//               : "Extract / Reprocess"}
//           </button>

//           {/* Replace */}
//           <label className="block cursor-pointer text-center text-sm font-medium text-gray-600 hover:text-gray-900">
//             Replace Document

//             <input
//               type="file"
//               accept=".pdf,.png,.jpg,.jpeg"
//               className="hidden"
//               disabled={uploading}
//               onChange={(event) => {
//                 const file =
//                   event.target.files?.[0];

//                 if (file) {
//                   onUpload(type, file);
//                 }

//                 event.target.value = "";
//               }}
//             />
//           </label>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
//             <p className="text-sm font-medium text-gray-700">
//               Document missing
//             </p>

//             <p className="mt-1 text-xs text-gray-500">
//               Upload the required document.
//             </p>
//           </div>

//           <label className="block cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-gray-800">
//             {uploading
//               ? "Uploading..."
//               : "Upload Document"}

//             <input
//               type="file"
//               accept=".pdf,.png,.jpg,.jpeg"
//               className="hidden"
//               disabled={uploading}
//               onChange={(event) => {
//                 const file =
//                   event.target.files?.[0];

//                 if (file) {
//                   onUpload(type, file);
//                 }

//                 event.target.value = "";
//               }}
//             />
//           </label>
//         </div>
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    COMPARISON RESULT
// ========================================================= */

// interface ComparisonResultProps {
//   comparison: DocumentComparison;
// }

// function ComparisonResult({
//   comparison,
// }: ComparisonResultProps) {
//   const isMatch =
//     comparison.overallStatus === "MATCH";

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
//       {/* Comparison Header */}
//       <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="text-lg font-semibold text-gray-900">
//             Document Verification
//           </h2>

//           <p className="mt-1 text-sm text-gray-500">
//             Vendor master data compared with extracted
//             document information.
//           </p>
//         </div>

//         <span
//           className={`inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${
//             isMatch
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {comparison.overallStatus}
//         </span>
//       </div>

//       {/* Missing Documents */}
//       {comparison.missingDocuments.length > 0 && (
//         <div className="border-b border-gray-200 bg-yellow-50 p-5">
//           <h3 className="text-sm font-semibold text-yellow-800">
//             Missing Documents
//           </h3>

//           <div className="mt-3 flex flex-wrap gap-2">
//             {comparison.missingDocuments.map(
//               (document) => (
//                 <span
//                   key={document}
//                   className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800"
//                 >
//                   {documentLabels[
//                     document as DocumentType
//                   ] || document}
//                 </span>
//               ),
//             )}
//           </div>
//         </div>
//       )}

//       {/* Fields */}
//       <div className="divide-y divide-gray-100">
//         {Object.entries(comparison.fields).map(
//           ([field, result]) => {
//             const matched =
//               result.status === "MATCH";

//             return (
//               <div
//                 key={field}
//                 className="p-5"
//               >
//                 {/* Field Header */}
//                 <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//                   <h3 className="font-semibold text-gray-900">
//                     {fieldLabels[field] || field}
//                   </h3>

//                   <span
//                     className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
//                       matched
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {result.status}
//                   </span>
//                 </div>

//                 <div className="grid gap-4 lg:grid-cols-2">
//                   {/* Vendor */}
//                   <div className="rounded-lg border border-gray-200 p-4">
//                     <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//                       Vendor Master Value
//                     </p>

//                     <p className="mt-2 break-words text-sm font-medium text-gray-900">
//                       {result.vendorValue ||
//                         "—"}
//                     </p>
//                   </div>

//                   {/* Documents */}
//                   <div className="rounded-lg border border-gray-200 p-4">
//                     <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//                       Document Values
//                     </p>

//                     <div className="mt-2 space-y-2">
//                       {result.documentValues.length >
//                       0 ? (
//                         result.documentValues.map(
//                           (value, index) => (
//                             <div
//                               key={`${value}-${index}`}
//                               className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
//                             >
//                               <span className="break-words text-sm font-medium text-gray-900">
//                                 {value || "—"}
//                               </span>

//                               <span className="text-xs text-gray-500">
//                                 {sourceLabels[
//                                   result.sources[
//                                     index
//                                   ]
//                                 ] ||
//                                   result.sources[
//                                     index
//                                   ] ||
//                                   "Document"}
//                               </span>
//                             </div>
//                           ),
//                         )
//                       ) : (
//                         <span className="text-sm text-gray-500">
//                           No document value
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           },
//         )}
//       </div>

//       {/* Mismatch Summary */}
//       {comparison.mismatches.length > 0 && (
//         <div className="border-t border-gray-200 bg-red-50 p-5">
//           <h3 className="text-sm font-semibold text-red-800">
//             Mismatched Fields
//           </h3>

//           <div className="mt-3 flex flex-wrap gap-2">
//             {comparison.mismatches.map(
//               (field) => (
//                 <span
//                   key={field}
//                   className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
//                 >
//                   {fieldLabels[field] || field}
//                 </span>
//               ),
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






import { useEffect, useState } from "react";

import {
  compareVendorDocuments,
  extractDocument,
  getVendorDocuments,
  uploadDocument,
  type DocumentComparison,
  type DocumentType,
  type VendorDocument,
} from "../../api/document.api";

interface VendorDocumentsProps {
  vendorId: string;
}

const documentLabels: Record<DocumentType, string> = {
  registration: "Registration Certificate",
  gst: "GST Certificate",
  bank: "Bank Document",
};

const documentTypes: DocumentType[] = [
  "registration",
  "gst",
  "bank",
];

const fieldLabels: Record<string, string> = {
  companyName: "Company Name",
  registrationNumber: "Registration Number",
  gstNumber: "GST Number",
  address: "Address",
  bankAccountNumber: "Bank Account Number",
  ifscCode: "IFSC Code",
};

const sourceLabels: Record<string, string> = {
  registration: "Registration",
  gst: "GST",
  bank: "Bank",
};

const getStatusClasses = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "match":
    case "matched":
    case "verified":
    case "processed":
    case "extracted":
      return "bg-green-100 text-green-700";

    case "mismatch":
    case "failed":
    case "rejected":
      return "bg-red-100 text-red-700";

    case "missing":
      return "bg-yellow-100 text-yellow-700";

    case "processing":
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "uploaded":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function VendorDocuments({
  vendorId,
}: VendorDocumentsProps) {
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [comparison, setComparison] =
    useState<DocumentComparison | null>(null);

  const [loading, setLoading] = useState(true);
  const [comparisonLoading, setComparisonLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState<DocumentType | null>(null);

  const [extracting, setExtracting] =
    useState<string | null>(null);

  const [selectedDocument, setSelectedDocument] =
    useState<VendorDocument | null>(null);

  const [extractSuccess, setExtractSuccess] =
    useState("");

  const [extractError, setExtractError] =
    useState("");

  const loadDocuments = async () => {
    try {
      setLoading(true);

      const response = await getVendorDocuments(vendorId);

      setDocuments(response?.data || []);
    } catch (error) {
      console.error(
        "Failed to load documents:",
        error
      );

      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [vendorId]);

  const getDocumentByType = (
    type: DocumentType
  ) => {
    return documents.find(
      (document) => document.type === type
    );
  };

  const refreshComparison = async () => {
    try {
      const response =
        await compareVendorDocuments(vendorId);

      setComparison(response?.data || null);
    } catch (error) {
      console.error(
        "Failed to refresh comparison:",
        error
      );
    }
  };

  const handleFileUpload = async (
    type: DocumentType,
    file: File
  ) => {
    try {
      setUploading(type);

      await uploadDocument(
        vendorId,
        type,
        file
      );

      await loadDocuments();
      await refreshComparison();
    } catch (error) {
      console.error(
        "Document upload failed:",
        error
      );

      alert("Document upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleExtract = async (
    documentId: string
  ) => {
    try {
      setExtracting(documentId);
      setExtractSuccess("");
      setExtractError("");

      await extractDocument(documentId);

      await loadDocuments();
      await refreshComparison();

      setExtractSuccess(
        "Document extracted successfully."
      );
    } catch (error) {
      console.error(
        "Document extraction failed:",
        error
      );

      setExtractError(
        "Document extraction failed. Please try again."
      );
    } finally {
      setExtracting(null);
    }
  };

  const handleCompare = async () => {
    try {
      setComparisonLoading(true);

      const response =
        await compareVendorDocuments(vendorId);

      setComparison(response?.data || null);
    } catch (error) {
      console.error(
        "Document comparison failed:",
        error
      );

      alert("Document comparison failed");
    } finally {
      setComparisonLoading(false);
    }
  };

  const openDocumentModal = (
    document: VendorDocument
  ) => {
    setSelectedDocument(document);
    setExtractSuccess("");
    setExtractError("");
  };

  const closeDocumentModal = () => {
    if (extracting) return;

    setSelectedDocument(null);
    setExtractSuccess("");
    setExtractError("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                📄
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Vendor Documents
                </h2>

                <p className="text-sm text-gray-500">
                  Upload, process and verify vendor documents.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCompare}
            disabled={comparisonLoading}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {comparisonLoading
              ? "Comparing..."
              : "Compare Documents"}
          </button>
        </div>
      </div>

      {/* Document cards */}
      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          Loading documents...
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {documentTypes.map((type) => {
            const document =
              getDocumentByType(type);

            return (
              <DocumentCard
                key={type}
                type={type}
                document={document}
                uploading={uploading === type}
                extracting={
                  extracting === document?._id
                }
                onUpload={handleFileUpload}
                onOpenModal={openDocumentModal}
              />
            );
          })}
        </div>
      )}

      {/* Comparison */}
      {comparison && (
        <ComparisonResult
          comparison={comparison}
        />
      )}

      {/* Extract Modal */}
      {selectedDocument && (
        <DocumentModal
          document={selectedDocument}
          extracting={
            extracting === selectedDocument._id
          }
          successMessage={extractSuccess}
          errorMessage={extractError}
          onClose={closeDocumentModal}
          onExtract={async () => {
            await handleExtract(
              selectedDocument._id
            );

            const response =
              await getVendorDocuments(vendorId);

            const updatedDocuments =
              response?.data || [];

            const updatedDocument =
              updatedDocuments.find(
                (doc: VendorDocument) =>
                  doc._id === selectedDocument._id
              );

            if (updatedDocument) {
              setSelectedDocument(
                updatedDocument
              );
            }
          }}
        />
      )}
    </div>
  );
}

/* =========================================================
   DOCUMENT CARD
========================================================= */

interface DocumentCardProps {
  type: DocumentType;
  document?: VendorDocument;
  uploading: boolean;
  extracting: boolean;
  onUpload: (
    type: DocumentType,
    file: File
  ) => void;
  onOpenModal: (
    document: VendorDocument
  ) => void;
}

function DocumentCard({
  type,
  document,
  uploading,
  extracting,
  onUpload,
  onOpenModal,
}: DocumentCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Card Header */}
      <div className="border-b border-gray-100 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg">
              📄
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                {documentLabels[type]}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {type}
              </p>
            </div>
          </div>

          {document ? (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                document.status
              )}`}
            >
              {document.status}
            </span>
          ) : (
            <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
              Missing
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {document ? (
          <div className="space-y-4">
            {/* File */}
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                File
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                {document.originalName ||
                  document.fileName ||
                  "Uploaded document"}
              </p>
            </div>

            {/* Extraction Summary */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Extracted Data
                </p>

                <button
                  type="button"
                  onClick={() =>
                    onOpenModal(document)
                  }
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View Details
                </button>
              </div>

              {document.extractedData &&
              Object.keys(
                document.extractedData
              ).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(
                    document.extractedData
                  )
                    .slice(0, 3)
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-start justify-between gap-3"
                      >
                        <span className="text-xs text-gray-500">
                          {fieldLabels[key] || key}
                        </span>

                        <span className="max-w-[60%] truncate text-right text-xs font-medium text-gray-800">
                          {value
                            ? String(value)
                            : "—"}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center">
                  <p className="text-xs text-gray-500">
                    No extracted data available.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <button
              type="button"
              onClick={() =>
                onOpenModal(document)
              }
              disabled={extracting}
              className="w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {extracting
                ? "Processing..."
                : "Extract / Reprocess"}
            </button>

            <label className="block cursor-pointer rounded-lg border border-gray-200 px-3 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              {uploading
                ? "Uploading..."
                : "Replace Document"}

              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                disabled={uploading}
                onChange={(event) => {
                  const file =
                    event.target.files?.[0];

                  if (file) {
                    onUpload(type, file);
                  }

                  event.target.value = "";
                }}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                ⚠️
              </div>

              <p className="mt-3 text-sm font-semibold text-gray-700">
                Document Missing
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Upload the required document.
              </p>
            </div>

            <label className="block cursor-pointer rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800">
              {uploading
                ? "Uploading..."
                : "Upload Document"}

              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                disabled={uploading}
                onChange={(event) => {
                  const file =
                    event.target.files?.[0];

                  if (file) {
                    onUpload(type, file);
                  }

                  event.target.value = "";
                }}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   DOCUMENT MODAL
========================================================= */

interface DocumentModalProps {
  document: VendorDocument;
  extracting: boolean;
  successMessage: string;
  errorMessage: string;
  onClose: () => void;
  onExtract: () => Promise<void>;
}

function DocumentModal({
  document,
  extracting,
  successMessage,
  errorMessage,
  onClose,
  onExtract,
}: DocumentModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-modal-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-gray-200 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              📄
            </div>

            <div>
              <h2
                id="document-modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                {documentLabels[
                  document.type
                ]}
              </h2>

              <p className="mt-1 max-w-lg truncate text-sm text-gray-500">
                {document.originalName ||
                  document.fileName ||
                  "Uploaded document"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={extracting}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          <div className="mb-5 flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Document Status
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {document.status}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                document.status
              )}`}
            >
              {document.status}
            </span>
          </div>

          {successMessage && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              ✓ {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              ✕ {errorMessage}
            </div>
          )}

          <div>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Extracted Information
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Data extracted from the uploaded document.
              </p>
            </div>

            {document.extractedData &&
            Object.keys(
              document.extractedData
            ).length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(
                  document.extractedData
                ).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <p className="text-xs font-medium text-gray-500">
                      {fieldLabels[key] || key}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-gray-900">
                      {value
                        ? String(value)
                        : "—"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <p className="text-sm font-medium text-gray-600">
                  No extracted data available.
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Click Reprocess to extract document data.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={extracting}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onExtract}
            disabled={extracting}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {extracting
              ? "Extracting..."
              : "Extract / Reprocess"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPARISON RESULT
========================================================= */

interface ComparisonResultProps {
  comparison: DocumentComparison;
}

function ComparisonResult({
  comparison,
}: ComparisonResultProps) {
  const isMatched =
    comparison.overallStatus === "MATCHED" ||
    comparison.overallStatus === "MATCH";

  const isMissing =
    comparison.overallStatus === "MISSING";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Document Verification
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Vendor master data compared with extracted
              document information.
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${
              isMatched
                ? "bg-green-100 text-green-700"
                : isMissing
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {comparison.overallStatus}
          </span>
        </div>
      </div>

      {/* Missing Documents */}
      {comparison.missingDocuments.length > 0 && (
        <div className="border-b border-yellow-200 bg-yellow-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100">
              ⚠️
            </div>

            <div>
              <h3 className="text-sm font-semibold text-yellow-900">
                Missing Documents
              </h3>

              <p className="mt-1 text-xs text-yellow-800">
                The following required documents have not
                been uploaded.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {comparison.missingDocuments.map(
              (document) => (
                <span
                  key={document}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-yellow-800 ring-1 ring-yellow-200"
                >
                  {documentLabels[
                    document as DocumentType
                  ] || document}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* Fields */}
      <div className="divide-y divide-gray-100">
        {Object.entries(comparison.fields).map(
          ([field, result]) => {
            const matched =
              result.status === "MATCHED" ||
              result.status === "MATCH";

            const missing =
              result.status === "MISSING";

            return (
              <div
                key={field}
                className="p-5"
              >
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {fieldLabels[field] || field}
                  </h3>

                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                      matched
                        ? "bg-green-100 text-green-700"
                        : missing
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {result.status}
                  </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {/* Vendor */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Vendor Master Value
                    </p>

                    <p className="mt-2 break-words text-sm font-semibold text-gray-900">
                      {result.vendorValue || "—"}
                    </p>
                  </div>

                  {/* Documents */}
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Document Values
                    </p>

                    <div className="mt-3 space-y-2">
                      {result.documentValues.length >
                      0 ? (
                        result.documentValues.map(
                          (value, index) => (
                            <div
                              key={`${value}-${index}`}
                              className="flex flex-col gap-1 rounded-lg bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <span className="break-words text-sm font-medium text-gray-900">
                                {value || "—"}
                              </span>

                              <span className="text-xs font-medium text-gray-500">
  {sourceLabels[result.sources?.[index] || ""] ||
    result.sources?.[index] ||
    "Document"}
</span>
                            </div>
                          )
                        )
                      ) : (
                        <span className="text-sm text-gray-500">
                          No document value
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Mismatch Summary */}
      {comparison.mismatches.length > 0 && (
        <div className="border-t border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
              !
            </div>

            <div>
              <h3 className="text-sm font-semibold text-red-900">
                Mismatched Fields
              </h3>

              <p className="mt-1 text-xs text-red-700">
                These fields contain values that differ from
                the vendor master data.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {comparison.mismatches.map(
              (field) => (
                <span
                  key={field}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200"
                >
                  {fieldLabels[field] || field}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

