import Pengaturan from "@/app/componen/Cpengaturan/Pengaturan";
import Navbar_Sidebar from "@/app/componen/Cumum/Navbar_Sidebar";

export default function PengaturanPage() {
  return (
    <>
      <Navbar_Sidebar>
        <div className="-mt-28">
          <Pengaturan />
        </div>
      </Navbar_Sidebar>
    </>
  )
}
