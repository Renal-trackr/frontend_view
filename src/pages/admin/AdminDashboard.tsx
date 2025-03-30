import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord administrateur</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Médecins</CardTitle>
            <CardDescription>Gestion des comptes médecins</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Médecins actifs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Patients</CardTitle>
            <CardDescription>Total des patients enregistrés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">247</p>
            <p className="text-sm text-muted-foreground">Patients au total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activité</CardTitle>
            <CardDescription>Consultations ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">86</p>
            <p className="text-sm text-muted-foreground">Consultations réalisées</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
