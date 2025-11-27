import History from "@/app/componen/Chistory/History";
import Footer from "@/app/componen/Cumum/Footer";
import Navbar_Sidebar from "@/app/componen/Cumum/Navbar_Sidebar";
import NavbarS from "@/app/componen/Cumum/NavbarS";

export default function HistoryPage(){
  return(
    <>
    <Navbar_Sidebar>
    <History/>
    <Footer/>
    </Navbar_Sidebar>
    </>

  )
}