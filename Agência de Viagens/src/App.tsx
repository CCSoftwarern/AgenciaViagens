import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Promotions } from "./components/Promotions";
import { Cruises } from "./components/cruises";
import { ContactForm } from "./components/ContactForm";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { LoginPage } from "./components/admin/LoginPage";
import { DashboardLayout } from "./components/admin/DashboardLayout";
import { DashboardStats } from "./components/admin/DashboardStats";
import { PromotionsManager } from "./components/admin/PromotionsManager";
import { ServicesManager } from "./components/admin/ServicesManager";
import { ContactManager } from "./components/admin/ContactManager";
import { AgencyManager } from "./components/admin/AgencyManager";
import { CruisesManager } from "./components/admin/CruisesManager";
import { ClientsManager } from "./components/admin/ClientsManager";
import { SalesManager } from "./components/admin/SalesManager";
import { Shield } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useAgency } from "./context/AgencyContext"





export default function App() {
  const { agencyInfo, loading } = useAgency();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentAdminPage, setCurrentAdminPage] = useState("dashboard");

  const loadingMessages = [
  "Preparando sua experiência",
  "Buscando as melhores ofertas",
  "Organizando sua próxima viagem",
];

const [messageIndex, setMessageIndex] = useState(0);

useEffect(() => {
  if (!loading) return;

  const interval = setInterval(() => {
    setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
  }, 2000);

  return () => clearInterval(interval);
}, [loading]);

if (loading) {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-white to-gray-50">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />

      <div className="text-center space-y-1">
        <p className="text-base font-semibold text-gray-700">
          Agência de Viagens
        </p>
        <p className="text-xs text-gray-500 transition-opacity duration-300">
          {loadingMessages[messageIndex]}
        </p>
      </div>
    </div>
  );
}


  // Se não estiver logado e tentar acessar admin
  if (showAdmin && !isLoggedIn) {
    return (
      <>
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
        <Toaster />
      </>
    );
  }

  // Admin logado
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
          {currentAdminPage === "contacts" && <ContactManager />}
          {currentAdminPage === "agencyInfo" && <AgencyManager />}
          {currentAdminPage === "cruises" && <CruisesManager />}
          {currentAdminPage === "clients" && <ClientsManager />}
          {currentAdminPage === "sales" &&  <SalesManager />}

        </DashboardLayout>
        <Toaster />
      </>
    )
    
  }


  
  // Site público
  return (
    <div className="min-h-screen">
      {/* Botão flutuante Admin */}
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        title="Acessar Admin"
      >
        <Shield className="w-6 h-6" />
      </button>

      <Header />
      <Hero />
      <Promotions />
      <Cruises />
       <Services />
      <ContactForm />
      <Footer />
      <Toaster />
    </div>
  );
}


