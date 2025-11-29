import Navbar_Sidebar from "@/app/componen/Cumum/Navbar_Sidebar";
import Wishlist from "@/app/componen/Cwishlist/Wishlist";

export default function wishlist() {
    return (
        <>
            <Navbar_Sidebar>
                <div className="-mt-28">
                    <Wishlist />
                </div>
            </Navbar_Sidebar>
        </>
    )
}