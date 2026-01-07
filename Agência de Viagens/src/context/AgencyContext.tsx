import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-0c7f2afa`;

interface AgencyInfo {
  id?: string;
  name?: string;
  slogan?: string;
  description?: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  watsapp?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youyube?: string;
  backgroundImage?: string;
  imglogo?: string;
  liberado?: boolean;
  // adicione outros campos conforme sua API
}

interface AgencyContextData {
  agencyInfo: AgencyInfo | null;
  loading: boolean;
}

export const AgencyContext = createContext<AgencyContextData | null>(null);

export function AgencyProvider({ children }: { children: ReactNode }) {
  const [agencyInfo, setAgencyInfo] = useState<AgencyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgencyInfo() {
      try {
        const response = await fetch(`${BASE_URL}/agencyinfos`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
        });
        const data = await response.json();
        // console.log("Carregar agency info", response);
        setAgencyInfo(data.agencyinfo);
      } catch (error) {
        // console.error("Erro ao carregar agency info", error);
      } finally {
        setLoading(false);
      }
    }

    loadAgencyInfo();
  }, []);

  return (
    <AgencyContext.Provider value={{ agencyInfo, loading }}>
      {children}
    </AgencyContext.Provider>
  );
}
export function useAgency() {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error("useAgency must be used within an AgencyProvider");
  }
  return context;
}