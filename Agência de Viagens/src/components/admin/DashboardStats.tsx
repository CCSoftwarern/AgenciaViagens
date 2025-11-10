import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tag, Settings, Users, TrendingUp } from "lucide-react";
import { DataSeeder } from "./DataSeeder";

export function DashboardStats() {
  const stats = [
    {
      title: "Total de Promoções",
      value: "6",
      icon: Tag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Serviços Ativos",
      value: "6",
      icon: Settings,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Orçamentos Recebidos",
      value: "28",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Taxa de Conversão",
      value: "32%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

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
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p>Nova solicitação de orçamento</p>
                  <p className="text-sm text-gray-500">João Silva - Caribe</p>
                </div>
                <span className="text-sm text-gray-500">Há 2h</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p>Promoção atualizada</p>
                  <p className="text-sm text-gray-500">Europa - 20% OFF</p>
                </div>
                <span className="text-sm text-gray-500">Há 5h</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p>Novo serviço adicionado</p>
                  <p className="text-sm text-gray-500">Cruzeiros Marítimos</p>
                </div>
                <span className="text-sm text-gray-500">Há 1d</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Destinos Mais Procurados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Caribe", count: 45, percentage: 85 },
                { name: "Europa", count: 38, percentage: 72 },
                { name: "Maldivas", count: 32, percentage: 60 },
                { name: "África", count: 28, percentage: 53 },
              ].map((destination, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span>{destination.name}</span>
                    <span className="text-sm text-gray-500">
                      {destination.count} buscas
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${destination.percentage}%` }}
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
