import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users, Activity } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#021122]">Tableau de bord administrateur</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md overflow-hidden">
          <CardHeader className="bg-[#FAFAFA]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#2980BA]">Médecins</CardTitle>
              <div className="p-2 rounded-full bg-[#2980BA]/10">
                <UserPlus className="h-5 w-5 text-[#2980BA]" />
              </div>
            </div>
            <CardDescription className="text-[#334349]">Gestion des comptes médecins</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-[#021122]">12</p>
            <p className="text-sm text-[#619DB5]">Médecins actifs</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md overflow-hidden">
          <CardHeader className="bg-[#FAFAFA]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#2980BA]">Patients</CardTitle>
              <div className="p-2 rounded-full bg-[#2980BA]/10">
                <Users className="h-5 w-5 text-[#2980BA]" />
              </div>
            </div>
            <CardDescription className="text-[#334349]">Total des patients enregistrés</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-[#021122]">247</p>
            <p className="text-sm text-[#619DB5]">Patients au total</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md overflow-hidden">
          <CardHeader className="bg-[#FAFAFA]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#2980BA]">Activité</CardTitle>
              <div className="p-2 rounded-full bg-[#2980BA]/10">
                <Activity className="h-5 w-5 text-[#2980BA]" />
              </div>
            </div>
            <CardDescription className="text-[#334349]">Consultations ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-[#021122]">86</p>
            <p className="text-sm text-[#619DB5]">Consultations réalisées</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
