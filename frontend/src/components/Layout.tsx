import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r bg-white p-5 md:block">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-slate-900">
            VendorVerify
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Vendor Verification Platform
          </p>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={navClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/vendors"
            className={navClass}
          >
            Vendors
          </NavLink>

          <NavLink
            to="/tasks"
            className={navClass}
          >
            Tasks
          </NavLink>
        </nav>
      </aside>

      <main className="md:ml-64">
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Vendor Verification
              </h2>

              <p className="text-sm text-slate-500">
                Manage vendor onboarding and verification
              </p>
            </div>

            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium">
              Admin
            </div>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}