
import React from "react";
import {
  CircleAlert,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Users,
  CalendarDays,
  ActivitySquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const patientsByStage = {
    "Stade 1": 12,
    "Stade 2": 24,
    "Stade 3": 18,
    "Stade 4": 8,
    "Stade 5": 3,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Dernière mise à jour:</span>
          <span className="text-sm font-medium">Aujourd'hui, 14:30</span>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Patients totaux</p>
                <p className="text-2xl font-bold">65</p>
              </div>
              <div className="h-12 w-12 bg-primary-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="h-4 w-4 text-secondary-600 mr-1" />
              <span className="text-xs font-medium text-secondary-600">+8% ce mois</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Consultations aujourd'hui</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="h-12 w-12 bg-secondary-50 rounded-full flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowDownRight className="h-4 w-4 text-primary-600 mr-1" />
              <span className="text-xs font-medium text-primary-600">-2 par rapport à hier</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Alertes actives</p>
                <p className="text-2xl font-bold">7</p>
              </div>
              <div className="h-12 w-12 bg-danger-50 rounded-full flex items-center justify-center">
                <CircleAlert className="h-6 w-6 text-danger-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="h-4 w-4 text-danger-600 mr-1" />
              <span className="text-xs font-medium text-danger-600">+3 nouvelles alertes</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Workflows actifs</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <div className="h-12 w-12 bg-primary-50 rounded-full flex items-center justify-center">
                <ActivitySquare className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs font-medium text-gray-500">Tous en cours d'exécution</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribution des patients par stade MRC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(patientsByStage).map(([stage, count]) => (
                <div key={stage} className="flex items-center">
                  <div className="w-32 text-sm">{stage}</div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-600 rounded-full"
                        style={{ 
                          width: `${(count / 65) * 100}%`,
                          backgroundColor: stage === "Stade 5" ? "#ef4444" : 
                                          stage === "Stade 4" ? "#f97316" : 
                                          stage === "Stade 3" ? "#eab308" : 
                                          stage === "Stade 2" ? "#3b82f6" : "#22c55e"
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-10 text-right text-sm font-medium">{count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Alertes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  patient: "Martin Dupont", 
                  issue: "Taux de créatinine élevé", 
                  time: "Il y a 35 min", 
                  severity: "danger" 
                },
                { 
                  patient: "Claire Laurent", 
                  issue: "Tension artérielle élevée", 
                  time: "Il y a 1h", 
                  severity: "warning" 
                },
                { 
                  patient: "Robert Petit", 
                  issue: "Rendez-vous manqué", 
                  time: "Il y a 3h", 
                  severity: "info" 
                },
                { 
                  patient: "Sophie Moreau", 
                  issue: "Résultats d'analyse anormaux", 
                  time: "Il y a 5h", 
                  severity: "danger" 
                },
              ].map((alert, index) => (
                <div key={index} className="flex items-start">
                  <div className={`alert-badge alert-badge-${alert.severity} mr-2 mt-0.5`}>
                    <CircleAlert className="h-3 w-3 mr-1" />
                    <span>{alert.severity === "danger" ? "Critique" : alert.severity === "warning" ? "Attention" : "Info"}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{alert.patient}</p>
                    <p className="text-xs text-gray-500">{alert.issue}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {alert.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming appointments */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Consultations à venir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 border-b">
                  <th className="pb-2 pl-4">Patient</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Heure</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Stade MRC</th>
                  <th className="pb-2 pr-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    patient: "Marie Lambert",
                    date: "Aujourd'hui",
                    time: "15:30",
                    type: "Suivi mensuel",
                    stage: "Stade 3",
                    status: "Confirmé"
                  },
                  {
                    patient: "Thomas Bernard",
                    date: "Aujourd'hui",
                    time: "16:15",
                    type: "Contrôle routine",
                    stage: "Stade 2",
                    status: "En attente"
                  },
                  {
                    patient: "Julien Martin",
                    date: "Aujourd'hui",
                    time: "17:00",
                    type: "Première consultation",
                    stage: "Indéterminé",
                    status: "Confirmé"
                  },
                  {
                    patient: "Aurélie Dubois",
                    date: "Demain",
                    time: "09:15",
                    type: "Résultats examens",
                    stage: "Stade 4",
                    status: "Confirmé"
                  },
                  {
                    patient: "Michel Leroy",
                    date: "Demain",
                    time: "10:30",
                    type: "Suivi mensuel",
                    stage: "Stade 3",
                    status: "En attente"
                  }
                ].map((appointment, index) => (
                  <tr 
                    key={index} 
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-3 pl-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium mr-2">
                          {appointment.patient.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{appointment.patient}</span>
                      </div>
                    </td>
                    <td className="py-3">{appointment.date}</td>
                    <td className="py-3">{appointment.time}</td>
                    <td className="py-3">{appointment.type}</td>
                    <td className="py-3">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${appointment.stage === "Stade 5" ? "bg-red-100 text-red-800" : 
                            appointment.stage === "Stade 4" ? "bg-orange-100 text-orange-800" : 
                            appointment.stage === "Stade 3" ? "bg-yellow-100 text-yellow-800" : 
                            appointment.stage === "Stade 2" ? "bg-blue-100 text-blue-800" : 
                            appointment.stage === "Stade 1" ? "bg-green-100 text-green-800" : 
                            "bg-gray-100 text-gray-800"}
                        `}
                      >
                        {appointment.stage}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "Confirmé" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
