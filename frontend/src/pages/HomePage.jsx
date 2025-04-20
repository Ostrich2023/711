import Header from "../components/Header";
import Footer from "../components/Footer";
import Home from "../components/Home";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>

  );
}