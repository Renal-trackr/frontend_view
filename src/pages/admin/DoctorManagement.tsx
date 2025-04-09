import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DoctorService from "@/services/DoctorService";

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
  const [submitting, setSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // Spécialité fixée à Néphrologie
  const speciality = "Néphrologie";

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DoctorService.getDoctors();
      setDoctors(data);
    } catch (error: any) {
      setError(error.message || "Impossible de récupérer la liste des médecins");
      toast({
        title: "Erreur",
        description: error.message || "Impossible de récupérer la liste des médecins",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      await DoctorService.createDoctor({
        firstname,
        lastname,
        email,
        speciality, // Utilisation de la valeur fixe
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
      setPhoneNumber("");
      
      // Actualiser la liste
      fetchDoctors();
      
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue lors de l'ajout du médecin");
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du médecin",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le statut du médecin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#021122]">Gestion des médecins</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Modification de la mise en page pour mieux organiser l'espace */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Formulaire d'ajout (prend 1/3 de l'espace sur les grands écrans) */}
        <div className="lg:col-span-1">
          <Card className="shadow-md">
            <CardHeader className="bg-[#FAFAFA]">
              <CardTitle className="text-[#2980BA]">Ajouter un médecin</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddDoctor}>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname" className="text-[#334349]">Prénom</Label>
                    <Input 
                      id="firstname"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      disabled={submitting}
                      required
                      className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname" className="text-[#334349]">Nom</Label>
                    <Input 
                      id="lastname"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      disabled={submitting}
                      required
                      className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#334349]">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={submitting}
                      required
                      className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="speciality" className="text-[#334349]">Spécialité</Label>
                    <Input 
                      id="speciality"
                      value={speciality}
                      disabled={true}
                      className="bg-[#ECE7E3] text-[#334349] border-[#91BDC8]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-[#334349]">Téléphone</Label>
                    <Input 
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={submitting}
                      required
                      className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-[#2980BA] hover:bg-[#619DB5] text-white mt-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Ajout en cours...
                      </>
                    ) : (
                      "Ajouter le médecin"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Liste des médecins (prend 2/3 de l'espace sur les grands écrans) */}
        <div className="lg:col-span-2">
          <Card className="h-full shadow-md">
            <CardHeader className="bg-[#FAFAFA]">
              <CardTitle className="text-[#2980BA]">Liste des médecins</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2980BA]" />
                  <p className="ml-2 text-[#334349]">Chargement des médecins...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[25%] text-[#334349]">Nom</TableHead>
                        <TableHead className="w-[30%] text-[#334349]">Email</TableHead>
                        <TableHead className="w-[20%] text-[#334349]">Spécialité</TableHead>
                        <TableHead className="w-[10%] text-[#334349]">Statut</TableHead>
                        <TableHead className="w-[15%] text-right text-[#334349]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-[#334349]">
                            Aucun médecin trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        doctors.map((doctor) => (
                          <TableRow key={doctor.id} className="hover:bg-[#ECE7E3]/20">
                            <TableCell className="font-medium text-[#021122]">
                              {doctor.firstname} {doctor.lastname}
                            </TableCell>
                            <TableCell className="text-[#334349]">{doctor.email}</TableCell>
                            <TableCell className="text-[#334349]">{doctor.speciality}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                doctor.status === 'active' 
                                  ? 'bg-[#619DB5]/20 text-[#2980BA]' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {doctor.status === 'active' ? 'Actif' : 'Inactif'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toggleDoctorStatus(doctor.id, doctor.status)}
                                disabled={loading}
                                className={doctor.status === 'active' 
                                  ? 'border-red-300 text-red-700 hover:bg-red-50' 
                                  : 'border-[#91BDC8] text-[#2980BA] hover:bg-[#ECE7E3]/20'
                                }
                              >
                                {doctor.status === 'active' ? 'Désactiver' : 'Activer'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;
