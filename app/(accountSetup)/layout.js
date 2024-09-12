import { poppins } from "@/utils/fonts";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/providers/AuthProvider";

export default function Layout({ children }) {
  return (
    <>
      <AuthProvider>
        <Toaster />
        <Navbar />
        <main className={poppins.className}>{children}</main>
      </AuthProvider>
    </>
  );
}
