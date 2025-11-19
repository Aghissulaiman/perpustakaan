"use client";

import NavbarAdmin from "@/app/componen/Cadmin/NavbarAdmin";
import TabelBuku from "@/app/componen/Cadmin/TabelBuku";
import { withAdmin } from "@/app/lib/withAdmin";

function Databuku() {
  return (
    <>
      <NavbarAdmin />
      <TabelBuku />
    </>
  );
}

export default withAdmin(Databuku);
