import DaftarBuku from "../componen/Chome/DaftarBuku";
import HeroH from "../componen/Chome/HeroH";
import JadwalKontak from "../componen/Chome/JadwalKontak";
import Footer from "../componen/Cumum/Footer";
import Navbar_Sidebar from "../componen/Cumum/Navbar_Sidebar";
import NavbarS from "../componen/Cumum/NavbarS";

export default function home () {
    return(
        <>
        <Navbar_Sidebar>

        {/* <HeroH/> */}
        <DaftarBuku/>
        <JadwalKontak/>
        <Footer/>
        </Navbar_Sidebar>
        </>
    )
}