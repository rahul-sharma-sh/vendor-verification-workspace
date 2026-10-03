import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createVendor,
  deleteVendor,
  getVendors,
  updateVendor,
  type Vendor,
} from "../api/vendor.api";

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    registrationNumber: "",
    gstNumber: "",
    bankAccountNumber: "",
    ifscCode: "",
  });

  const navigate = useNavigate();


  
  // =========================
  // Fetch Vendors
  // =========================

  const fetchVendors = async () => {
  try {
    setLoading(true);

    const response = await getVendors();

    const data = response?.data;

    if (Array.isArray(data)) {
      setVendors(data);
    } else {
      setVendors([]);
    }
  } catch (error) {
    console.error("Failed to fetch vendors:", error);
    setVendors([]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchVendors();
}, []);


  // =========================
  // Form Reset
  // =========================

  const resetForm = () => {
    setFormData({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      registrationNumber: "",
      gstNumber: "",
      bankAccountNumber: "",
      ifscCode: "",
    });
  };

  // =========================
  // Create Modal
  // =========================

  const openCreateModal = () => {
    setEditingVendor(null);
    resetForm();
    setShowModal(true);
  };

  // =========================
  // Edit Modal
  // =========================

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);

    setFormData({
      companyName: vendor.companyName || "",
      contactPerson: vendor.contactPerson || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      address: vendor.address || "",
      registrationNumber: vendor.registrationNumber || "",
      gstNumber: vendor.gstNumber || "",
      bankAccountNumber: vendor.bankAccountNumber || "",
      ifscCode: vendor.ifscCode || "",
    });

    setShowModal(true);
  };

  // =========================
  // Close Modal
  // =========================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingVendor(null);
    resetForm();
  };

  // =========================
  // Handle Input
  // =========================

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =========================
  // Create / Update
  // =========================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.companyName.trim()) {
      alert("Company name is required.");
      return;
    }

    if (!formData.contactPerson.trim()) {
      alert("Contact person is required.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Email is required.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Phone is required.");
      return;
    }

    try {
      setSaving(true);

      if (editingVendor) {
        await updateVendor(editingVendor._id, formData);
      } else {
        await createVendor(formData);
      }

      closeModal();

      await fetchVendors();
    } catch (error) {
      console.error("Failed to save vendor:", error);

      alert(
        editingVendor ? "Failed to update vendor." : "Failed to create vendor.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Delete Vendor
  // =========================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vendor?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteVendor(id);

      await fetchVendors();
    } catch (error) {
      console.error("Failed to delete vendor:", error);

      alert("Failed to delete vendor.");
    }
  };

  // =========================
  // Status Badge
  // =========================

  const getStatusClasses = (workflowStatus?: string) => {
    switch (workflowStatus) {
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

  return (
    <div className="space-y-6">
      {/* =====================================
          Page Header
      ====================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage vendor information and verification status.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          + Add Vendor
        </button>
      </div>

      {/* =====================================
          Search & Filter
      ====================================== */}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by company name..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Status */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Workflow Status
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Action Required">Action Required</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* =====================================
          Vendors Table
      ====================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              Loading vendors...
            </div>
          </div>
        ) : vendors.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-4 text-center">
            <div className="mb-3 text-4xl">🏢</div>

            <h3 className="text-lg font-semibold text-gray-900">
              No vendors found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or create a new vendor.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Add Vendor
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header */}

              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Company
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Contact Person
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Phone
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}

              <tbody className="divide-y divide-gray-200 bg-white">
                {vendors.map((vendor) => (
                  <tr key={vendor._id} className="transition hover:bg-gray-50">
                    {/* Company */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {vendor.companyName}
                      </div>

                      <div className="mt-1 text-xs text-gray-400">
                        {vendor.registrationNumber || "No registration number"}
                      </div>
                    </td>

                    {/* Contact Person */}

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {vendor.contactPerson || "-"}
                    </td>

                    {/* Email */}

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {vendor.email || "-"}
                    </td>

                    {/* Phone */}

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {vendor.phone || "-"}
                    </td>

                    {/* Status */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                          vendor.workflowStatus,
                        )}`}
                      >
                        {vendor.workflowStatus || "Draft"}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* View */}

                        <button
                          type="button"
                          onClick={() => navigate(`/vendors/${vendor._id}`)}
                          className="rounded-md border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                        >
                          View
                        </button>

                        {/* Edit */}

                        <button
                          type="button"
                          onClick={() => openEditModal(vendor)}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          onClick={() => handleDelete(vendor._id)}
                          className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================
          Create / Edit Modal
      ====================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingVendor ? "Edit Vendor" : "Create Vendor"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {editingVendor
                    ? "Update vendor information."
                    : "Add a new vendor to the system."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="text-2xl leading-none text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed"
              >
                ×
              </button>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {/* Basic Information */}

              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Basic Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Company Name */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Company Name *
                    </label>

                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(event) =>
                        handleInputChange("companyName", event.target.value)
                      }
                      placeholder="Enter company name"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Contact Person */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Contact Person *
                    </label>

                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(event) =>
                        handleInputChange("contactPerson", event.target.value)
                      }
                      placeholder="Enter contact person"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Email */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Email *
                    </label>

                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) =>
                        handleInputChange("email", event.target.value)
                      }
                      placeholder="company@example.com"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Phone */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Phone *
                    </label>

                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(event) =>
                        handleInputChange("phone", event.target.value)
                      }
                      placeholder="Enter phone number"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Address */}

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Address
                    </label>

                    <textarea
                      value={formData.address}
                      onChange={(event) =>
                        handleInputChange("address", event.target.value)
                      }
                      placeholder="Enter complete address"
                      rows={3}
                      className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Registration Information */}

              <div className="border-t border-gray-200 pt-5">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Registration Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Registration Number */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Registration Number
                    </label>

                    <input
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(event) =>
                        handleInputChange(
                          "registrationNumber",
                          event.target.value,
                        )
                      }
                      placeholder="Enter registration number"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* GST Number */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      GST Number
                    </label>

                    <input
                      type="text"
                      value={formData.gstNumber}
                      onChange={(event) =>
                        handleInputChange("gstNumber", event.target.value)
                      }
                      placeholder="Enter GST number"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Information */}

              <div className="border-t border-gray-200 pt-5">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Bank Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Bank Account */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Bank Account Number
                    </label>

                    <input
                      type="text"
                      value={formData.bankAccountNumber}
                      onChange={(event) =>
                        handleInputChange(
                          "bankAccountNumber",
                          event.target.value,
                        )
                      }
                      placeholder="Enter bank account number"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* IFSC */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      IFSC Code
                    </label>

                    <input
                      type="text"
                      value={formData.ifscCode}
                      onChange={(event) =>
                        handleInputChange("ifscCode", event.target.value)
                      }
                      placeholder="Enter IFSC code"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingVendor
                      ? "Update Vendor"
                      : "Create Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
