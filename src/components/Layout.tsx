import { Outlet } from "react-router-dom";
import Sidebar from "@/components/common/Sidebar";
import { RestaurantProvider } from "@/context/RestaurantContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function Layout() {
  return (
    <RestaurantProvider>
      <CategoriesProvider>
        <>
          <div className="flex bg-gray-100 min-h-screen h-screen font-poppins">
            <Sidebar />
            <main className="flex-1 px-5 overflow-y-scroll">
              <Outlet /> {/* This is where nested routes will be rendered */}
            </main>
          </div>

          <ToastContainer />
        </>
      </CategoriesProvider>
    </RestaurantProvider>
  );
}

export default Layout;
