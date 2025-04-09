import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, Calendar, Heart, User, Activity, BarChart, Brain, Clock, Clipboard, TrendingUp, TrendingDown } from "lucide-react";
import { PatientStatus, MRCStage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Exemple de données pour les graphiques
const chartData = [
  { date: "Jan", créatinine: 1.2, urée: 6.2, tgf: 80 },
  { date: "Fév", créatinine: 1.3, urée: 6.5, tgf: 75 },
  { date: "Mar", créatinine: 1.4, urée: 6.8, tgf: 72 },
  { date: "Avr", créatinine: 1.3, urée: 6.7, tgf: 73 },
  { date: "Mai", créatinine: 1.5, urée: 7.0, tgf: 70 },
  { date: "Juin", créatinine: 1.6, urée: 7.2, tgf: 68 },
];

// Distribution des patients par stade MRC
const stageDistribution = [
  { name: "Stade 1", value: 35, color: "#4ade80" },
  { name: "Stade 2", value: 45, color: "#a3e635" },
  { name: "Stade 3A", value: 24, color: "#facc15" },
  { name: "Stade 3B", value: 15, color: "#fb923c" },
  { name: "Stade 4", value: 5, color: "#f87171" },
  { name: "Stade 5", value: 3, color: "#ef4444" },
];

// Statistiques d'adhérence aux traitements
const adherenceData = [
  { name: "Médicaments", adhérence: 85 },
  { name: "Rendez-vous", adhérence: 78 },
  { name: "Examens", adhérence: 92 },
  { name: "Régime", adhérence: 65 },
];

// Recommandations d'IA
const aiRecommendations = [
  {
    id: 1,
    patient: "Jean Dupont",
    recommendation: "Considérer un ajustement de la dose de furosémide en raison de l'augmentation du taux de créatinine",
    confiance: 87,
    urgence: "medium",
  },
  {
    id: 2,
    patient: "Marie Martin",
    recommendation: "Planifier un échographie rénale pour évaluer une possible sténose de l'artère rénale", 
    confiance: 92,
    urgence: "high",
  },
  {
    id: 3,
    patient: "Robert Dubois",
    recommendation: "Envisager un suivi plus fréquent de la tension artérielle pour optimiser le traitement antihypertenseur",
    confiance: 78,
    urgence: "low",
  }
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#021122]">Tableau de bord</h1>
          <p className="text-[#619DB5]">Vue d'ensemble du suivi des patients MRC</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px] border-[#91BDC8] focus:ring-[#619DB5]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent className="border-[#91BDC8]">
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
          >
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-[#91BDC8] shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#334349]">Patients Total</CardTitle>
            <User className="h-4 w-4 text-[#2980BA]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#021122]">127</div>
            <p className="text-xs text-[#619DB5] mt-1">
              +6 nouveaux ce mois
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#91BDC8] shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#334349]">Cas critiques</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#021122]">8</div>
            <p className="text-xs text-[#619DB5] mt-1">
              2 nouveaux cette semaine
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#91BDC8] shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#334349]">Rendez-vous</CardTitle>
            <Calendar className="h-4 w-4 text-[#2980BA]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#021122]">24</div>
            <p className="text-xs text-[#619DB5] mt-1">
              Pour cette semaine
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#91BDC8] shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#334349]">Alertes</CardTitle>
            <Bell className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#021122]">7</div>
            <p className="text-xs text-[#619DB5] mt-1">
              3 nécessitent votre attention
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#91BDC8] shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#334349]">Patients à risque</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#021122]">8.7%</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-xs text-red-500">+2.4% ce mois</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader className="bg-[#FAFAFA]">
            <CardTitle className="text-[#2980BA]">Indicateurs de santé moyens</CardTitle>
            <CardDescription className="text-[#334349]">Évolution sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <Tabs defaultValue="créatinine">
              <TabsList className="border-[#91BDC8] bg-[#ECE7E3]/50">
                <TabsTrigger 
                  value="créatinine"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#2980BA]"
                >
                  Créatinine
                </TabsTrigger>
                <TabsTrigger 
                  value="urée"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#2980BA]"
                >
                  Urée
                </TabsTrigger>
                <TabsTrigger 
                  value="tgf"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#2980BA]"
                >
                  TFG
                </TabsTrigger>
              </TabsList>
              <TabsContent value="créatinine" className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="créatinine" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="urée" className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="urée" stroke="#10b981" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="tgf" className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tgf" stroke="#6366f1" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-[#FAFAFA]">
            <CardTitle className="text-[#2980BA]">Répartition des stades MRC</CardTitle>
            <CardDescription className="text-[#334349]">Distribution des patients par stade</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {stageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader className="bg-[#FAFAFA]">
            <CardTitle className="text-[#2980BA]">Recommandations d'IA</CardTitle>
            <CardDescription className="text-[#334349]">Suggestions basées sur l'analyse des données patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiRecommendations.map(rec => (
                <div key={rec.id} className="bg-[#ECE7E3]/30 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-[#2980BA]/20 mr-3">
                      <Brain className="h-5 w-5 text-[#2980BA]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-[#021122]">{rec.patient}</h4>
                        <Badge 
                          variant={rec.urgence === "high" ? "destructive" : rec.urgence === "medium" ? "default" : "outline"}
                          className={
                            rec.urgence === "high" ? "" : 
                            rec.urgence === "medium" ? "bg-[#2980BA] hover:bg-[#619DB5] text-white" : 
                            "border-[#91BDC8] text-[#334349]"
                          }
                        >
                          {rec.urgence === "high" ? "Urgent" : rec.urgence === "medium" ? "Moyen" : "Faible"}
                        </Badge>
                      </div>
                      <p className="text-sm mt-1 text-[#334349]">{rec.recommendation}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-[#619DB5] mr-2">Confiance IA:</span>
                        <Progress value={rec.confiance} className="h-2 flex-1 bg-[#ECE7E3]" 
                          indicatorClassName="bg-[#2980BA]" />
                        <span className="ml-2 text-xs font-medium text-[#334349]">{rec.confiance}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-[#91BDC8] text-[#2980BA] hover:bg-[#ECE7E3]/20">
              Voir toutes les recommandations
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-[#FAFAFA]">
            <CardTitle className="text-[#2980BA]">Adhérence aux traitements</CardTitle>
            <CardDescription className="text-[#334349]">Taux de suivi des recommandations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {adherenceData.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-[#334349]">{item.name}</span>
                  <span className={`text-xs font-medium ${
                    item.adhérence >= 80 ? "text-green-600" : 
                    item.adhérence >= 60 ? "text-amber-600" : "text-red-600"
                  }`}>{item.adhérence}%</span>
                </div>
                <Progress 
                  value={item.adhérence} 
                  className={`h-2 bg-[#ECE7E3] ${
                    item.adhérence >= 80 ? "[&>div]:bg-green-500" : 
                    item.adhérence >= 60 ? "[&>div]:bg-amber-500" : "[&>div]:bg-red-500"
                  }`} 
                />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-[#91BDC8] text-[#2980BA] hover:bg-[#ECE7E3]/20">
              Détails complets
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-[#FAFAFA]">
          <CardTitle className="text-[#2980BA]">Patients à surveiller</CardTitle>
          <CardDescription className="text-[#334349]">Patients qui nécessitent une attention particulière</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#ECE7E3]/70">
                <tr>
                  <th className="text-left font-medium p-2 text-[#334349]">Patient</th>
                  <th className="text-left font-medium p-2 text-[#334349]">Stade MRC</th>
                  <th className="text-left font-medium p-2 text-[#334349]">Statut</th>
                  <th className="text-left font-medium p-2 text-[#334349]">Dernier examen</th>
                  <th className="text-left font-medium p-2 text-[#334349]">Prochain RDV</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-[#ECE7E3]/20">
                  <td className="p-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#2980BA]/20 flex items-center justify-center mr-3">
                        <span className="font-medium text-[#2980BA]">JD</span>
                      </div>
                      <div>
                        <p className="font-medium text-[#021122]">Jean Dupont</p>
                        <p className="text-sm text-[#619DB5]">62 ans</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-[#334349]">Stade 4</td>
                  <td className="p-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Critique
                    </span>
                  </td>
                  <td className="p-2 text-[#334349]">Il y a 2 jours</td>
                  <td className="p-2 text-[#334349]">Demain, 10:30</td>
                </tr>
                <tr className="hover:bg-[#ECE7E3]/20">
                  <td className="p-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#2980BA]/20 flex items-center justify-center mr-3">
                        <span className="font-medium text-[#2980BA]">MM</span>
                      </div>
                      <div>
                        <p className="font-medium text-[#021122]">Marie Martin</p>
                        <p className="text-sm text-[#619DB5]">58 ans</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-[#334349]">Stade 3B</td>
                  <td className="p-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Surveillance
                    </span>
                  </td>
                  <td className="p-2 text-[#334349]">Il y a 15 jours</td>
                  <td className="p-2 text-[#334349]">03/07/2023</td>
                </tr>
                <tr className="hover:bg-[#ECE7E3]/20">
                  <td className="p-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#2980BA]/20 flex items-center justify-center mr-3">
                        <span className="font-medium text-[#2980BA]">RD</span>
                      </div>
                      <div>
                        <p className="font-medium text-[#021122]">Robert Dubois</p>
                        <p className="text-sm text-[#619DB5]">70 ans</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-[#334349]">Stade 3A</td>
                  <td className="p-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Surveillance
                    </span>
                  </td>
                  <td className="p-2 text-[#334349]">Il y a 5 jours</td>
                  <td className="p-2 text-[#334349]">10/07/2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
