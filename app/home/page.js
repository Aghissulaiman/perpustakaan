import DaftarBuku from "../componen/Chome/DaftarBuku";
import HeroH from "../componen/Chome/HeroH";
import JadwalKontak from "../componen/Chome/JadwalKontak";
import Footer from "../componen/Cumum/Footer";
import NavbarS from "../componen/Cumum/NavbarS";

export default function home () {
    return(
        <>
        <NavbarS/>
        {/* <HeroH/> */}
        <DaftarBuku/>
        <JadwalKontak/>
        <Footer/>
        </>
    )
}