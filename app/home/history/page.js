import History from "@/app/componen/Chistory/History";
import Footer from "@/app/componen/Cumum/Footer";
import Navbar_Sidebar from "@/app/componen/Cumum/Navbar_Sidebar";
import NavbarS from "@/app/componen/Cumum/NavbarS";

export default function HistoryPage() {
  return (
    <>
      <Navbar_Sidebar>
        <div className="-mt-28">
          <History />
        </div>
        <Footer />
      </Navbar_Sidebar>
    </>

  )
}