import Koleksi from "@/app/componen/Ckoleksi/Koleksi";
import Footer from "@/app/componen/Cumum/Footer";
import Navbar_Sidebar from "@/app/componen/Cumum/Navbar_Sidebar";
import NavbarS from "@/app/componen/Cumum/NavbarS";

export default function koleksi(){
    return(
        <>
        <Navbar_Sidebar>
        <Koleksi/>
        <Footer/>
        </Navbar_Sidebar>
        </>
    )
}