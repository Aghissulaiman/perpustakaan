"use client";

import Dashboard from "@/app/componen/Cadmin/Dashboard";
import NavbarAdmin from "@/app/componen/Cadmin/NavbarAdmin";
import { withAdmin } from "@/app/lib/withAdmin";

function DashboardPage() {
  return (
    <>
      <NavbarAdmin>

      <Dashboard />
      </NavbarAdmin>
    </>
  );
}

export default withAdmin(DashboardPage);
