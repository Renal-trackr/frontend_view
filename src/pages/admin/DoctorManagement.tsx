import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import DoctorService from "@/services/DoctorService";

// Type pour représenter un médecin
interface Doctor {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  speciality: string;
  phoneNumber: string;
  status: 'active' | 'inactive';
}

const DoctorManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [speciality, setSpeciality] = useState("Néphrologie");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await DoctorService.getDoctors();
      setDoctors(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des médecins",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      await DoctorService.createDoctor({
        firstname,
        lastname,
        email,
        speciality,
        phoneNumber
      });
      
      toast({
        title: "Succès",
        description: "Le médecin a été ajouté avec succès. Un email avec les identifiants de connexion a été envoyé.",
      });
      
      // Réinitialiser le formulaire
      setFirstname("");
      setLastname("");
      setEmail("");
      setSpeciality("Néphrologie");
      setPhoneNumber("");
      
      // Actualiser la liste
      fetchDoctors();
      
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du médecin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDoctorStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      setLoading(true);
      await DoctorService.toggleDoctorStatus(id, currentStatus === 'inactive');
      
      toast({
        title: "Succès",
        description: `Le médecin a été ${currentStatus === 'active' ? 'désactivé' : 'activé'} avec succès`,
      });
      
      fetchDoctors();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du médecin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des médecins</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un médecin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddDoctor}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">Prénom</Label>
                  <Input 
                    id="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Nom</Label>
                  <Input 
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speciality">Spécialité</Label>
                  <Select 
                    value={speciality} 
                    onValueChange={setSpeciality}
                  >
                    <SelectTrigger id="speciality">
                      <SelectValue placeholder="Sélectionner une spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Néphrologie">Néphrologie</SelectItem>
                      <SelectItem value="Néphrologie pédiatrique">Néphrologie pédiatrique</SelectItem>
                      <SelectItem value="Néphrologie gériatrique">Néphrologie gériatrique</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Téléphone</Label>
                  <Input 
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Chargement..." : "Ajouter le médecin"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Liste des médecins</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Chargement des médecins...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Spécialité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Aucun médecin trouvé</TableCell>
                    </TableRow>
                  ) : (
                    doctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell>{doctor.firstname} {doctor.lastname}</TableCell>
                        <TableCell>{doctor.email}</TableCell>
                        <TableCell>{doctor.speciality}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            doctor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {doctor.status === 'active' ? 'Actif' : 'Inactif'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleDoctorStatus(doctor.id, doctor.status)}
                            disabled={loading}
                          >
                            {doctor.status === 'active' ? 'Désactiver' : 'Activer'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorManagement;
