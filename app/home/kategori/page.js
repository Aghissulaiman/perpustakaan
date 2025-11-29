import KategoriBuku from "@/app/componen/Ckategori/KategoriBuku";
import Navbar_Sidebar from "@/app/componen/Cumum/Navbar_Sidebar";

export default function kategori() {
    return (
        <>
            <Navbar_Sidebar>
                <div className="-mt-28">
                    <KategoriBuku />
                </div>
            </Navbar_Sidebar>
        </>
    )
}