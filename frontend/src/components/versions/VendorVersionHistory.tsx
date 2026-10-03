import { useEffect, useState } from "react";
import {
  getVendorVersions,
  restoreVendorVersion,
  type VendorVersion,
} from "../../api/version.api";

interface VendorVersionHistoryProps {
  vendorId: string;
  onRestored?: () => void;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const maskValue = (value: string) => {
  if (!value) return "-";

  if (value.length <= 4) {
    return value;
  }

  return `${value.slice(0, 2)}${"*".repeat(
    Math.max(3, value.length - 4),
  )}${value.slice(-2)}`;
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "Verified":
      return "bg-green-100 text-green-700";

    case "Action Required":
      return "bg-red-100 text-red-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    case "Draft":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

export default function VendorVersionHistory({
  vendorId,
  onRestored,
}: VendorVersionHistoryProps) {
  const [versions, setVersions] = useState<VendorVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState("");

  const loadVersions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getVendorVersions(vendorId);

      setVersions(response?.data ?? []);
    } catch (err) {
      console.error("Failed to load vendor versions:", err);
      setError("Failed to load version history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) {
      loadVersions();
    }
  }, [vendorId]);

  const handleRestore = async (
    version: VendorVersion,
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to restore Version ${version.version}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setRestoringId(version._id);
      setError("");

      await restoreVendorVersion(
        vendorId,
        version._id,
      );

      await loadVersions();

      onRestored?.();

      window.alert(
        `Version ${version.version} restored successfully.`,
      );
    } catch (err) {
      console.error("Failed to restore version:", err);
      setError("Failed to restore selected version.");
    } finally {
      setRestoringId(null);
    }
  };

  if (loading) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Version History
        </h2>

        <p className="text-sm text-gray-500">
          Loading version history...
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Version History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Previous vendor record versions
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {versions.length} version
          {versions.length !== 1 ? "s" : ""}
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {versions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500">
            No version history available.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map((version, index) => (
            <div
              key={version._id}
              className="rounded-xl border border-gray-200 p-5"
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-bold text-blue-700">
                    v{version.version}
                  </span>

                  {index === 0 && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Latest
                    </span>
                  )}
                </div>

                <span className="text-sm text-gray-500">
                  {formatDate(version.createdAt)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Company Name
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {version.data.companyName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Contact Person
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {version.data.contactPerson || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {version.data.email || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Registration Number
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {version.data.registrationNumber || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    GST Number
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {version.data.gstNumber || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Bank Account
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {maskValue(
                      version.data.bankAccountNumber,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    IFSC
                  </p>

                  <p className="mt-1 text-sm text-gray-800">
                    {version.data.ifscCode || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Workflow Status
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      version.data.workflowStatus,
                    )}`}
                  >
                    {version.data.workflowStatus || "-"}
                  </span>
                </div>
              </div>

              {index !== 0 && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleRestore(version)
                    }
                    disabled={
                      restoringId === version._id
                    }
                    className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {restoringId === version._id
                      ? "Restoring..."
                      : `Restore v${version.version}`}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}