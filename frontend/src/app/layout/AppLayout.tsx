import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "../router/ScrollToTop";
import { useHealthCheck } from "../../hooks/useHealthCheck";

export default function AppLayout() {
  useHealthCheck();

  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
