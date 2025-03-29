import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Heart,
  Calendar,
  Phone,
  MapPin,
  Mail,
  FileText,
  ClipboardList,
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Stethoscope,
  AlertTriangle,
  Pill,
} from "lucide-react";
import { PatientStatus, MRCStage } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

type StepProps = {
  onNext: () => void;
  onPrevious: () => void;
  formData: any;
  updateFormData: (data: any) => void;
};

// Étape 1 : Informations personnelles
const PersonalInfoStep: React.FC<StepProps> = ({ 
  onNext, 
  formData, 
  updateFormData 
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    updateFormData({ ...formData, [field]: value });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName?.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }
    
    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Le nom est requis";
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "La date de naissance est requise";
    }
    
    if (!formData.gender) {
      newErrors.gender = "Le genre est requis";
    }
    
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Le numéro de téléphone est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Informations personnelles</h2>
        <p className="text-sm text-gray-500">Entrez les informations de base du patient</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom <span className="text-danger-500">*</span></Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            placeholder="Prénom du patient"
            className={errors.firstName ? "border-danger-500" : ""}
          />
          {errors.firstName && <p className="text-xs text-danger-500">{errors.firstName}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom <span className="text-danger-500">*</span></Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            placeholder="Nom du patient"
            className={errors.lastName ? "border-danger-500" : ""}
          />
          {errors.lastName && <p className="text-xs text-danger-500">{errors.lastName}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date de naissance <span className="text-danger-500">*</span></Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ""}
            onChange={handleChange}
            className={errors.dateOfBirth ? "border-danger-500" : ""}
          />
          {errors.dateOfBirth && <p className="text-xs text-danger-500">{errors.dateOfBirth}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Genre <span className="text-danger-500">*</span></Label>
          <Select
            value={formData.gender || ""}
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <SelectTrigger id="gender" className={errors.gender ? "border-danger-500" : ""}>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Homme</SelectItem>
              <SelectItem value="female">Femme</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-xs text-danger-500">{errors.gender}</p>}
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            placeholder="Adresse complète du patient"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Téléphone <span className="text-danger-500">*</span></Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              placeholder="Numéro de téléphone"
              className={errors.phoneNumber ? "border-danger-500" : ""}
            />
            {errors.phoneNumber && <p className="text-xs text-danger-500">{errors.phoneNumber}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Adresse email"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleNext}>
          Suivant
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Étape 2 : Informations médicales
const MedicalInfoStep: React.FC<StepProps> = ({ 
  onNext, 
  onPrevious, 
  formData, 
  updateFormData 
}) => {
  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState({ name: "", dosage: "", frequency: "" });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (field: string, value: string) => {
    updateFormData({ ...formData, [field]: value });
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      const conditions = [...(formData.medicalConditions || []), newCondition];
      updateFormData({ ...formData, medicalConditions: conditions });
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    const conditions = [...(formData.medicalConditions || [])];
    conditions.splice(index, 1);
    updateFormData({ ...formData, medicalConditions: conditions });
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      const allergies = [...(formData.allergies || []), newAllergy];
      updateFormData({ ...formData, allergies });
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    const allergies = [...(formData.allergies || [])];
    allergies.splice(index, 1);
    updateFormData({ ...formData, allergies });
  };

  const addMedication = () => {
    if (newMedication.name.trim() && newMedication.dosage.trim() && newMedication.frequency.trim()) {
      const medications = [...(formData.medications || []), { ...newMedication }];
      updateFormData({ ...formData, medications });
      setNewMedication({ name: "", dosage: "", frequency: "" });
    }
  };

  const removeMedication = (index: number) => {
    const medications = [...(formData.medications || [])];
    medications.splice(index, 1);
    updateFormData({ ...formData, medications });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Informations médicales</h2>
        <p className="text-sm text-gray-500">Ajoutez les antécédents médicaux et traitements en cours</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mrcStage">Stade MRC</Label>
            <Select
              value={formData.mrcStage || ""}
              onValueChange={(value) => handleSelectChange("mrcStage", value)}
            >
              <SelectTrigger id="mrcStage">
                <SelectValue placeholder="Sélectionner un stade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MRCStage.STAGE_1}>Stade 1</SelectItem>
                <SelectItem value={MRCStage.STAGE_2}>Stade 2</SelectItem>
                <SelectItem value={MRCStage.STAGE_3A}>Stade 3A</SelectItem>
                <SelectItem value={MRCStage.STAGE_3B}>Stade 3B</SelectItem>
                <SelectItem value={MRCStage.STAGE_4}>Stade 4</SelectItem>
                <SelectItem value={MRCStage.STAGE_5}>Stade 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="patientStatus">Statut du patient</Label>
            <Select
              value={formData.patientStatus || ""}
              onValueChange={(value) => handleSelectChange("patientStatus", value)}
            >
              <SelectTrigger id="patientStatus">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PatientStatus.STABLE}>Stable</SelectItem>
                <SelectItem value={PatientStatus.MONITORING}>Surveillance</SelectItem>
                <SelectItem value={PatientStatus.CRITICAL}>Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Separator />
        
        {/* Section Conditions médicales */}
        <div className="space-y-3">
          <Label className="text-base">Conditions médicales</Label>
          <div className="flex gap-2">
            <Input
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Ajouter une condition médicale"
            />
            <Button type="button" onClick={addCondition}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {(formData.medicalConditions || []).map((condition: string, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-secondary-50 rounded-md">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-danger-500 mr-2" />
                  <span>{condition}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeCondition(index)}>
                  Supprimer
                </Button>
              </div>
            ))}
            {(formData.medicalConditions || []).length === 0 && (
              <p className="text-sm text-gray-500">Aucune condition médicale ajoutée</p>
            )}
          </div>
        </div>
        
        {/* Section Allergies */}
        <div className="space-y-3">
          <Label className="text-base">Allergies</Label>
          <div className="flex gap-2">
            <Input
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Ajouter une allergie"
            />
            <Button type="button" onClick={addAllergy}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {(formData.allergies || []).map((allergy: string, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-secondary-50 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-warning-500 mr-2" />
                  <span>{allergy}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeAllergy(index)}>
                  Supprimer
                </Button>
              </div>
            ))}
            {(formData.allergies || []).length === 0 && (
              <p className="text-sm text-gray-500">Aucune allergie ajoutée</p>
            )}
          </div>
        </div>
        
        {/* Section Médicaments */}
        <div className="space-y-3">
          <Label className="text-base">Médicaments actuels</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              value={newMedication.name}
              onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
              placeholder="Nom du médicament"
            />
            <Input
              value={newMedication.dosage}
              onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
              placeholder="Dosage"
            />
            <div className="flex gap-2">
              <Input
                value={newMedication.frequency}
                onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                placeholder="Fréquence"
              />
              <Button type="button" onClick={addMedication}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {(formData.medications || []).map((med: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-secondary-50 rounded-md">
                <div className="flex items-center">
                  <Pill className="h-4 w-4 text-primary-500 mr-2" />
                  <span>{med.name} - {med.dosage} - {med.frequency}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeMedication(index)}>
                  Supprimer
                </Button>
              </div>
            ))}
            {(formData.medications || []).length === 0 && (
              <p className="text-sm text-gray-500">Aucun médicament ajouté</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="medicalNotes">Notes médicales</Label>
          <Textarea
            id="medicalNotes"
            name="medicalNotes"
            value={formData.medicalNotes || ""}
            onChange={handleChange}
            placeholder="Informations médicales supplémentaires"
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        <Button onClick={onNext}>
          Suivant
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Étape 3 : Informations administratives
const AdministrativeInfoStep: React.FC<StepProps> = ({ 
  onNext, 
  onPrevious, 
  formData, 
  updateFormData 
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.referringPhysician?.trim()) {
      newErrors.referringPhysician = "Le médecin référent est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Informations administratives</h2>
        <p className="text-sm text-gray-500">Complétez les données administratives du patient</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientId">Numéro de dossier</Label>
            <Input
              id="patientId"
              name="patientId"
              value={formData.patientId || ""}
              onChange={handleChange}
              placeholder="Automatiquement généré si vide"
              disabled
            />
            <p className="text-xs text-gray-500">Ce numéro sera généré automatiquement</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="referringPhysician">Médecin référent <span className="text-danger-500">*</span></Label>
            <Input
              id="referringPhysician"
              name="referringPhysician"
              value={formData.referringPhysician || ""}
              onChange={handleChange}
              placeholder="Nom du médecin référent"
              className={errors.referringPhysician ? "border-danger-500" : ""}
            />
            {errors.referringPhysician && <p className="text-xs text-danger-500">{errors.referringPhysician}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="insuranceInfo">Informations d'assurance</Label>
          <Textarea
            id="insuranceInfo"
            name="insuranceInfo"
            value={formData.insuranceInfo || ""}
            onChange={handleChange}
            placeholder="Détails de l'assurance maladie"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-base">Consentements</Label>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="consentTreatment" 
                checked={formData.consentTreatment || false}
                onCheckedChange={(checked) => updateFormData({ ...formData, consentTreatment: checked })}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="consentTreatment" className="text-sm font-normal">
                  Consentement au traitement
                </Label>
                <p className="text-xs text-gray-500">
                  Le patient consent à recevoir des soins médicaux
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="consentDataSharing" 
                checked={formData.consentDataSharing || false}
                onCheckedChange={(checked) => updateFormData({ ...formData, consentDataSharing: checked })}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="consentDataSharing" className="text-sm font-normal">
                  Partage des données médicales
                </Label>
                <p className="text-xs text-gray-500">
                  Le patient consent au partage de ses données médicales avec d'autres professionnels de santé impliqués dans son traitement
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="administrativeNotes">Notes administratives</Label>
          <Textarea
            id="administrativeNotes"
            name="administrativeNotes"
            value={formData.administrativeNotes || ""}
            onChange={handleChange}
            placeholder="Informations administratives supplémentaires"
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        <Button onClick={handleNext}>
          Suivant
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Étape 4 : Résumé et confirmation
const SummaryStep: React.FC<StepProps> = ({ 
  onPrevious, 
  formData, 
  updateFormData 
}) => {
  const navigate = useNavigate();
  
  const handleSubmit = () => {
    // Ici, vous devriez envoyer les données au serveur
    console.log("Données du formulaire à soumettre:", formData);
    
    // Simuler l'enregistrement et naviguer vers la liste des patients
    toast({
      title: "Patient enregistré avec succès",
      description: `${formData.firstName} ${formData.lastName} a été ajouté à votre liste de patients.`,
    });
    
    navigate("/patients");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Résumé et confirmation</h2>
        <p className="text-sm text-gray-500">Vérifiez les informations du patient avant l'enregistrement</p>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Nom</p>
                <p className="text-sm">{formData.lastName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Prénom</p>
                <p className="text-sm">{formData.firstName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Date de naissance</p>
                <p className="text-sm">{formData.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Genre</p>
                <p className="text-sm">{formData.gender === "male" ? "Homme" : formData.gender === "female" ? "Femme" : "Autre"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium">Adresse</p>
                <p className="text-sm">{formData.address || "Non renseignée"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <p className="text-sm">{formData.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{formData.email || "Non renseigné"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations médicales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Stade MRC</p>
                <p className="text-sm">
                  {formData.mrcStage ? (
                    <Badge variant={
                      formData.mrcStage === MRCStage.STAGE_1 || formData.mrcStage === MRCStage.STAGE_2 ? 
                        "outline" : 
                      formData.mrcStage === MRCStage.STAGE_3A || formData.mrcStage === MRCStage.STAGE_3B ? 
                        "secondary" : 
                        "destructive"
                    }>
                      Stade {formData.mrcStage}
                    </Badge>
                  ) : "Non renseigné"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Statut</p>
                <p className="text-sm">
                  {formData.patientStatus ? (
                    <Badge variant={
                      formData.patientStatus === PatientStatus.STABLE ? 
                        "outline" : 
                      formData.patientStatus === PatientStatus.MONITORING ? 
                        "default" : 
                        "destructive"
                    }>
                      {formData.patientStatus === PatientStatus.STABLE ? "Stable" : 
                       formData.patientStatus === PatientStatus.MONITORING ? "Surveillance" : 
                       "Critique"}
                    </Badge>
                  ) : "Non renseigné"}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium">Conditions médicales</p>
              {(formData.medicalConditions || []).length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {(formData.medicalConditions || []).map((condition: string, index: number) => (
                    <Badge key={index} variant="outline">{condition}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucune condition médicale renseignée</p>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium">Allergies</p>
              {(formData.allergies || []).length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {(formData.allergies || []).map((allergy: string, index: number) => (
                    <Badge key={index} variant="outline">{allergy}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucune allergie renseignée</p>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium">Médicaments actuels</p>
              {(formData.medications || []).length > 0 ? (
                <div className="space-y-2 mt-1">
                  {(formData.medications || []).map((med: any, index: number) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{med.name}</span> - {med.dosage} - {med.frequency}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucun médicament renseigné</p>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium">Notes médicales</p>
              <p className="text-sm">{formData.medicalNotes || "Aucune note médicale"}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations administratives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Médecin référent</p>
                <p className="text-sm">{formData.referringPhysician}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Informations d'assurance</p>
                <p className="text-sm">{formData.insuranceInfo || "Non renseignées"}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium">Consentements</p>
              <div className="space-y-1 mt-1">
                <div className="flex items-center">
                  <Check className={`h-4 w-4 mr-2 ${formData.consentTreatment ? "text-success-500" : "text-gray-300"}`} />
                  <p className="text-sm">Consentement au traitement</p>
                </div>
                <div className="flex items-center">
                  <Check className={`h-4 w-4 mr-2 ${formData.consentDataSharing ? "text-success-500" : "text-gray-300"}`} />
                  <p className="text-sm">Partage des données médicales</p>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium">Notes administratives</p>
              <p className="text-sm">{formData.administrativeNotes || "Aucune note administrative"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        <Button onClick={handleSubmit}>
          Enregistrer le patient
          <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Composant principal pour l'enregistrement d'un patient
const PatientRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Des valeurs par défaut peuvent être ajoutées ici
  });
  
  const steps = [
    "Informations personnelles",
    "Informations médicales",
    "Informations administratives",
    "Résumé"
  ];
  
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const updateFormData = (data: any) => {
    setFormData({
      ...formData,
      ...data
    });
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <MedicalInfoStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <AdministrativeInfoStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <SummaryStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Enregistrer un nouveau patient</h1>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-1">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div 
                  className={`py-1 px-3 rounded-full text-sm ${
                    currentStep === index + 1 
                      ? "bg-primary-500 text-white" 
                      : currentStep > index + 1 
                      ? "bg-primary-100 text-primary-700" 
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {index + 1}. {step}
                </div>
                {index < steps.length - 1 && (
                  <div className="h-px w-8 bg-gray-200" />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRegistration;
