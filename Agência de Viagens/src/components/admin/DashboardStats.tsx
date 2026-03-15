import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { Tag, Settings, Users, TrendingUp, Ship } from "lucide-react";
import { DataSeeder } from "./DataSeeder";
import { createClient } from "@supabase/supabase-js";
import { VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY } from "../../utils/supabase/info";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY);

export function DashboardStats() {
const [statsData, setStats] = useState<any>(null);
const [rankingSales, setRankingSales] = useState<any>(null);

useEffect(() => {
  loadStats();
  loadRankingSales();
}, []);

async function loadStats() {

  const { data, error } = await supabase
    .from("view_kv_store_stats")
    .select("*")
    .single();

  if (error) {
    console.error("Erro ao carregar stats:", error);
    return;
  }

  setStats(data);
}

if (!statsData) {
  return <p>Carregando...</p>;
}

// Melhores vendedores do Mês
async function loadRankingSales() {
  const { data, error } = await supabase
    .from("view_ranking_vendas_mes")
    .select("*")

  if (error) {
    console.error("Erro ao carregar stats:", error);
    return;
  }

  setRankingSales(data);
  console.log(data);
}

if (!rankingSales) {
  return <p>Carregando...</p>;
}




const stats = [
  {
    title: "Total de Promoções",
    value: statsData.promotions,
    icon: Tag,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Serviços Ativos",
    value: statsData.service,
    icon: Settings,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Cruzeiros",
    value: statsData.cruises,
    icon: Ship,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Vendas",
    value: statsData.sales,
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

const atividadesRecentes =[
  {
    title: "Ultima solicitação de orçamento",
    value: statsData?.last_contact?.name,
    createdAt: statsData?.last_contact?.createdAt

  },
  {
    title: "Promoção atualizada",
    value: statsData?.last_promotion?.title,
    createdAt: statsData?.last_promotion?.createdAt
  },
  {
    title: "Ultimo serviço",
    value: statsData?.last_service?.title,
    createdAt: statsData?.last_service?.createdAt

  }

];


function tempoRelativo(data: any) {
  if (!data) return "";

  const date = new Date(data);

  if (isNaN(date.getTime())) return "";

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: ptBR
  });
}

  return (
    <div>
      <h1 className="text-3xl mb-8">Dashboard</h1>

      <DataSeeder />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       <Card>
  <CardHeader>
    <CardTitle>Atividade Recente</CardTitle>
  </CardHeader>

  <CardContent>
    <div className="space-y-4">

      {atividadesRecentes.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-2 border-b"
        >
          <div>
            <p>{item.title}</p>
            <p className="text-sm text-gray-500">
              {item.value || "Sem informações"}
            </p>
          </div>
<span className="text-sm text-gray-500">
  {tempoRelativo(item.createdAt)}
</span>
        </div>
      ))}

    </div>
  </CardContent>
</Card>
        <Card>
          <CardHeader>
            <CardTitle>Ranking de vendedores do Mês</CardTitle>
          </CardHeader>
              <CardContent>
        <div className="space-y-4">

          {rankingSales?.map((destination, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span>{destination.nm_vendedor}</span>
                <span className="text-sm text-gray-500">
                  {destination.total_vendas} venda(s) - {destination.percentual_total}% - Total: {destination.valor_total}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${destination.percentual_total}%` }}
                />
              </div>
            </div>
          ))}

        </div>
      </CardContent>
        </Card>
      </div>
    </div>
  );
}
