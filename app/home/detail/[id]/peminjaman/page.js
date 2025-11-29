import PeminjamanForm from "@/app/componen/Cpeminjaman/PeminjamanForm";
import Navbar_Sidebar from "@/app/componen/Cumum/Navbar_Sidebar";

export default function peminjaman(){
    return(
        <>
        <Navbar_Sidebar>
            <div className="-mt-28">
        <PeminjamanForm/>
            </div>
        </Navbar_Sidebar>
        </>
    )
}


