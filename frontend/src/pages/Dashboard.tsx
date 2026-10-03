import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api/axios";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";

interface Vendor {
  _id: string;
  companyName: string;
  email: string;
  workflowStatus: string;
}

export default function Dashboard() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    try {
      const response = await api.get("/vendors");

      setVendors(response.data.data || []);
    } catch (error) {
      console.error("Failed to load vendors:", error);
    } finally {
      setLoading(false);
    }
  }

  const stats = {
    total: vendors.length,

    actionRequired: vendors.filter(
      (vendor) => vendor.workflowStatus === "Action Required"
    ).length,

    approved: vendors.filter(
      (vendor) => vendor.workflowStatus === "Approved"
    ).length,

    rejected: vendors.filter(
      (vendor) => vendor.workflowStatus === "Rejected"
    ).length,
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-slate-500">
          Overview of vendor verification activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          title="Total Vendors"
          value={stats.total}
        />

        <Stat
          title="Action Required"
          value={stats.actionRequired}
        />

        <Stat
          title="Approved"
          value={stats.approved}
        />

        <Stat
          title="Rejected"
          value={stats.rejected}
        />
      </div>

      {/* Recent Vendors */}
      <div className="mt-8 overflow-hidden rounded-xl border bg-white">
        <div className="border-b px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Vendors
              </h2>

              <p className="text-sm text-slate-500">
                Latest vendor verification records
              </p>
            </div>

            <Link
              to="/vendors"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">
            Loading vendors...
          </div>
        ) : vendors.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No vendors found.
          </div>
        ) : (
          <div className="divide-y">
            {vendors.slice(0, 5).map((vendor) => (
              <Link
                key={vendor._id}
                to={`/vendors/${vendor._id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {vendor.companyName}
                  </p>

                  <p className="text-sm text-slate-500">
                    {vendor.email}
                  </p>
                </div>

                <StatusBadge
                  status={vendor.workflowStatus}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}