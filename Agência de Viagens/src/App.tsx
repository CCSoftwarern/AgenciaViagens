import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Promotions } from "./components/Promotions";
import { ContactForm } from "./components/ContactForm";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { LoginPage } from "./components/admin/LoginPage";
import { DashboardLayout } from "./components/admin/DashboardLayout";
import { DashboardStats } from "./components/admin/DashboardStats";
import { PromotionsManager } from "./components/admin/PromotionsManager";
import { ServicesManager } from "./components/admin/ServicesManager";
import { Button } from "./components/ui/button";
import { Shield } from "lucide-react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentAdminPage, setCurrentAdminPage] = useState("dashboard");

  // Se não estiver logado e tentar acessar admin, mostrar página de login
  if (showAdmin && !isLoggedIn) {
    return (
      <>
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
        <Toaster />
      </>
    );
  }

  // Se estiver logado e em modo admin, mostrar dashboard
  if (showAdmin && isLoggedIn) {
    return (
      <>
        <DashboardLayout
          currentPage={currentAdminPage}
          onNavigate={setCurrentAdminPage}
          onLogout={() => {
            setIsLoggedIn(false);
            setShowAdmin(false);
            setCurrentAdminPage("dashboard");
          }}
        >
          {currentAdminPage === "dashboard" && <DashboardStats />}
          {currentAdminPage === "promotions" && <PromotionsManager />}
          {currentAdminPage === "services" && <ServicesManager />}
        </DashboardLayout>
        <Toaster />
      </>
    );
  }

  // Site público
  return (
    <div className="min-h-screen">
      {/* Botão flutuante para acessar o admin */}
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        title="Acessar Admin"
      >
        <Shield className="w-6 h-6" />
      </button>

      <Header />
      <Hero />
      <Services />
      <Promotions />
      <ContactForm />
      <Footer />
      <Toaster />
    </div>
  );
}
