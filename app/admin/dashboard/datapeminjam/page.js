"use client";

import NavbarAdmin from "@/app/componen/Cadmin/NavbarAdmin";
import TabelPeminjam from "@/app/componen/Cadmin/TabelPeminjam";
import { withAdmin } from "@/app/lib/withAdmin";

function Datapeminjam() {
  return (
    <>
      <NavbarAdmin>

      <TabelPeminjam />
      </NavbarAdmin>
    </>
  );
}

export default withAdmin(Datapeminjam);
