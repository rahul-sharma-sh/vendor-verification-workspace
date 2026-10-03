import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sendMissingDocumentsEmail } from "../api/vendor.api";

import {
  getVendorById,
  type Vendor,
} from "../api/vendor.api";

import VendorDocuments from "../components/documents/VendorDocuments";

import VendorVersionHistory from "../components/versions/VendorVersionHistory";
import VendorTasks from "../components/tasks/VendorTasks";


const VendorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [emailSending, setEmailSending] = useState(false);
const [emailSuccess, setEmailSuccess] = useState("");
const [emailError, setEmailError] = useState("");

  const fetchVendor = async () => {
    if (!id) {
      setError("Vendor ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getVendorById(id);

      /*
       * Expected backend response:
       *
       * {
       *   success: true,
       *   data: {...}
       * }
       */

      if (response?.data) {
        setVendor(response.data);
      } else {
        setVendor(null);
        setError("Vendor not found.");
      }
    } catch (err) {
      console.error("Failed to fetch vendor:", err);
      setError("Failed to load vendor details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const handleSendMissingDocumentsEmail = async () => {
  if (!vendor?._id) return;

  try {
    setEmailSending(true);
    setEmailSuccess("");
    setEmailError("");

    const response = await sendMissingDocumentsEmail(vendor._id);

    setEmailSuccess(
      `Email sent successfully to ${response.data?.vendorEmail || vendor.email}`
    );
  } catch (error: any) {
    console.error("Failed to send email:", error);

    setEmailError(
      error?.response?.data?.message ||
        "Failed to send missing documents email"
    );
  } finally {
    setEmailSending(false);
  }
};

  const getStatusClasses = (status?: string) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-700";

      case "Action Required":
        return "bg-red-100 text-red-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Draft":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          Loading vendor details...
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="mb-3 text-4xl">⚠️</div>

        <h2 className="text-lg font-semibold text-gray-900">
          {error || "Vendor not found"}
        </h2>

        <button
          type="button"
          onClick={() => navigate("/vendors")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to Vendors
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* =====================================
          Header
      ====================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <button
            type="button"
            onClick={() => navigate("/vendors")}
            className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Vendors
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            {vendor.companyName}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Vendor details and verification information
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClasses(
              vendor.workflowStatus,
            )}`}
          >
            {vendor.workflowStatus || "Draft"}
          </span>

        
        </div>
      </div>

      {/* =====================================
          Basic Information
      ====================================== */}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Basic Information
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            label="Company Name"
            value={vendor.companyName}
          />

          <InfoItem
            label="Contact Person"
            value={vendor.contactPerson}
          />

          <InfoItem
            label="Email"
            value={vendor.email}
          />

          <InfoItem
            label="Phone"
            value={vendor.phone}
          />

          <InfoItem
            label="Address"
            value={vendor.address}
          />

          <InfoItem
            label="Vendor ID"
            value={vendor._id}
          />
        </div>
      </div>

      {/* =====================================
          Registration Information
      ====================================== */}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Registration Information
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <InfoItem
            label="Registration Number"
            value={vendor.registrationNumber}
          />

          <InfoItem
            label="GST Number"
            value={vendor.gstNumber}
          />
        </div>
      </div>

      {/* =====================================
          Bank Information
      ====================================== */}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Bank Information
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <InfoItem
            label="Bank Account Number"
            value={vendor.bankAccountNumber}
          />

          <InfoItem
            label="IFSC Code"
            value={vendor.ifscCode}
          />
        </div>
      </div>

      {/* =====================================
          Verification Information
      ====================================== */}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Verification
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Workflow Status
            </p>

            <span
              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                vendor.workflowStatus,
              )}`}
            >
              {vendor.workflowStatus || "Draft"}
            </span>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              OpenCorporates Verification
            </p>

            <span
              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                vendor.openCorporatesVerification?.status,
              )}`}
            >
              {vendor.openCorporatesVerification?.status || "Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================
          Record Information
      ====================================== */}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Record Information
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <InfoItem
            label="Created At"
            value={formatDate(vendor.createdAt)}
          />

          <InfoItem
            label="Last Updated"
            value={formatDate(vendor.updatedAt)}
          />
        </div>
      </div>

      

      {/* =====================================
          Next Features
      ====================================== */}

      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
        <h2 className="text-base font-semibold text-gray-900">
          Vendor Workflow
        </h2>

        <div className="flex flex-wrap items-center gap-3">
  <button
    type="button"
    onClick={handleSendMissingDocumentsEmail}
    disabled={emailSending}
    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {emailSending ? "Sending Email..." : "Send Missing Documents Email"}
  </button>

  {emailSuccess && (
    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
      ✓ {emailSuccess}
    </div>
  )}

  {emailError && (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
      ✕ {emailError}
    </div>
  )}
</div>

        <p className="mt-1 text-sm text-gray-500">
          Documents, comparison, version history and tasks will
          appear here.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <VendorDocuments vendorId={vendor._id} />

          <div className="mt-6">
  <VendorVersionHistory
    vendorId={vendor._id}
    onRestored={fetchVendor}
  />
</div>



<div className="mt-6">
  <VendorTasks vendorId={vendor._id} />
</div>


        </div>
      </div>
    </div>
  );
};

/* =========================================
   Info Item
========================================= */

interface InfoItemProps {
  label: string;
  value?: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="break-words text-sm font-medium text-gray-900">
        {value || "-"}
      </p>
    </div>
  );
};

/* =========================================
   Workflow Card
========================================= */

interface WorkflowCardProps {
  title: string;
  description: string;
}

const WorkflowCard = ({
  title,
  description,
}: WorkflowCardProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  );
};

export default VendorDetails;