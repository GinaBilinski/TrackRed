// App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import { useAuth } from "./context/AuthContext";
import Hinzufuegen from "./pages/Hinzufuegen";
import Untersuchungen from "./pages/Untersuchungen";
import Werte from "./pages/Werte";

function App() {
  const { showModal, closeModal } = useAuth();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/werte" element={<Werte />} />
        <Route path="/hinzufuegen" element={<Hinzufuegen />} />
        <Route path="/untersuchungen" element={<Untersuchungen />} />
        <Route path="/werte" element={<Werte />} />
      </Routes>
      <Footer />
      {showModal && <LoginModal onClose={closeModal} />}{" "}
      {/* Modal nur anzeigen wenn true */}
    </BrowserRouter>
  );
}

export default App;
