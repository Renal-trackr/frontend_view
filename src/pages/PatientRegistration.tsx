import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
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
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  AlertTriangle,
  Pill,
  Loader2,
} from "lucide-react";
import { PatientStatus, MRCStage } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import PatientService from "@/services/PatientService";
import AuthService from "@/services/AuthService";

type StepProps = {
  onNext: () => void;
  onPrevious: () => void;
  formData: any;
  updateFormData: (data: any) => void;
};


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
        <h2 className="text-xl font-semibold text-[#021122]">Informations personnelles</h2>
        <p className="text-sm text-[#334349]">Entrez les informations de base du patient</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-[#334349]">Prénom <span className="text-red-500">*</span></Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            placeholder="Prénom du patient"
            className={`border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5] ${errors.firstName ? "border-red-500" : ""}`}
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-[#334349]">Nom <span className="text-red-500">*</span></Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            placeholder="Nom du patient"
            className={`border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5] ${errors.lastName ? "border-red-500" : ""}`}
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="text-[#334349]">Date de naissance <span className="text-red-500">*</span></Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ""}
            onChange={handleChange}
            className={`border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5] ${errors.dateOfBirth ? "border-red-500" : ""}`}
          />
          {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-[#334349]">Genre <span className="text-red-500">*</span></Label>
          <Select
            value={formData.gender || ""}
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <SelectTrigger id="gender" className={`border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5] ${errors.gender ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Homme</SelectItem>
              <SelectItem value="female">Femme</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
        </div>
      </div>
      
      <Separator className="bg-[#91BDC8]/50" />
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address" className="text-[#334349]">Adresse</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            placeholder="Adresse complète du patient"
            rows={3}
            className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-[#334349]">Téléphone <span className="text-red-500">*</span></Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              placeholder="Numéro de téléphone"
              className={`border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5] ${errors.phoneNumber ? "border-red-500" : ""}`}
            />
            {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#334349]">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Adresse email"
              className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleNext} className="bg-[#2980BA] hover:bg-[#619DB5] text-white">
          Suivant
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};


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
        <h2 className="text-xl font-semibold text-[#021122]">Informations médicales</h2>
        <p className="text-sm text-[#334349]">Ajoutez les antécédents médicaux et traitements en cours</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mrcStage" className="text-[#334349]">Stade MRC</Label>
            <Select
              value={formData.mrcStage || ""}
              onValueChange={(value) => handleSelectChange("mrcStage", value)}
            >
              <SelectTrigger id="mrcStage" className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]">
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
            <Label htmlFor="bloodGroup" className="text-[#334349]">Groupe sanguin</Label>
            <Select
              value={formData.bloodGroup || ""}
              onValueChange={(value) => handleSelectChange("bloodGroup", value)}
            >
              <SelectTrigger id="bloodGroup" className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]">
                <SelectValue placeholder="Sélectionner un groupe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="Unknown">Inconnu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="patientStatus" className="text-[#334349]">Statut du patient</Label>
            <Select
              value={formData.patientStatus || ""}
              onValueChange={(value) => handleSelectChange("patientStatus", value)}
            >
              <SelectTrigger id="patientStatus" className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]">
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
        
        <Separator className="bg-[#91BDC8]/50" />
        
        {/* Section Conditions médicales */}
        <div className="space-y-3">
          <Label className="text-base text-[#334349]">Conditions médicales</Label>
          <div className="flex gap-2">
            <Input
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Ajouter une condition médicale"
              className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
            />
            <Button type="button" onClick={addCondition} className="bg-[#2980BA] hover:bg-[#619DB5] text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {(formData.medicalConditions || []).map((condition: string, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-red-500 mr-2" />
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
          <Label className="text-base text-[#334349]">Allergies</Label>
          <div className="flex gap-2">
            <Input
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Ajouter une allergie"
              className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
            />
            <Button type="button" onClick={addAllergy} className="bg-[#2980BA] hover:bg-[#619DB5] text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {(formData.allergies || []).map((allergy: string, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
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
          <Label className="text-base text-[#334349]">Médicaments actuels</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              value={newMedication.name}
              onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
              placeholder="Nom du médicament"
              className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
            />
            <Input
              value={newMedication.dosage}
              onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
              placeholder="Dosage"
              className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
            />
            <div className="flex gap-2">
              <Input
                value={newMedication.frequency}
                onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                placeholder="Fréquence"
                className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
              />
              <Button type="button" onClick={addMedication} className="bg-[#2980BA] hover:bg-[#619DB5] text-white">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {(formData.medications || []).map((med: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
                <div className="flex items-center">
                  <Pill className="h-4 w-4 text-blue-500 mr-2" />
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
          <Label htmlFor="medicalNotes" className="text-[#334349]">Notes médicales</Label>
          <Textarea
            id="medicalNotes"
            name="medicalNotes"
            value={formData.medicalNotes || ""}
            onChange={handleChange}
            placeholder="Informations médicales supplémentaires"
            rows={3}
            className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} className="border-[#91BDC8] text-[#2980BA] hover:bg-[#619DB5] hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        <Button onClick={onNext} className="bg-[#2980BA] hover:bg-[#619DB5] text-white">
          Suivant
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};


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
        <h2 className="text-xl font-semibold text-[#021122]">Informations administratives</h2>
        <p className="text-sm text-[#334349]">Complétez les données administratives du patient</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientId" className="text-[#334349]">Numéro de dossier</Label>
            <Input
              id="patientId"
              name="patientId"
              value={formData.patientId || ""}
              onChange={handleChange}
              placeholder="Automatiquement généré si vide"
              disabled
              className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
            />
            <p className="text-xs text-gray-500">Ce numéro sera généré automatiquement</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="referringPhysician" className="text-[#334349]">Médecin référent <span className="text-red-500">*</span></Label>
            <Input
              id="referringPhysician"
              name="referringPhysician"
              value={formData.referringPhysician || ""}
              onChange={handleChange}
              placeholder="Nom du médecin référent"
              className={`border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5] ${errors.referringPhysician ? "border-red-500" : ""}`}
            />
            {errors.referringPhysician && <p className="text-xs text-red-500">{errors.referringPhysician}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="insuranceInfo" className="text-[#334349]">Informations d'assurance</Label>
          <Textarea
            id="insuranceInfo"
            name="insuranceInfo"
            value={formData.insuranceInfo || ""}
            onChange={handleChange}
            placeholder="Détails de l'assurance maladie"
            rows={3}
            className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-base text-[#334349]">Consentements</Label>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="consentTreatment" 
                checked={formData.consentTreatment || false}
                onCheckedChange={(checked) => updateFormData({ ...formData, consentTreatment: checked })}
                className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="consentTreatment" className="text-sm font-normal text-[#334349]">
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
                className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="consentDataSharing" className="text-sm font-normal text-[#334349]">
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
          <Label htmlFor="administrativeNotes" className="text-[#334349]">Notes administratives</Label>
          <Textarea
            id="administrativeNotes"
            name="administrativeNotes"
            value={formData.administrativeNotes || ""}
            onChange={handleChange}
            placeholder="Informations administratives supplémentaires"
            rows={3}
            className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} className="border-[#91BDC8] text-[#2980BA] hover:bg-[#619DB5] hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        <Button onClick={handleNext} className="bg-[#2980BA] hover:bg-[#619DB5] text-white">
          Suivant
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};


const SummaryStep: React.FC<StepProps> = ({ 
  onPrevious, 
  formData, 
  updateFormData 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {

      const doctorInfo = AuthService.getDoctorInfo();
      if (!doctorInfo || !doctorInfo.doctor || !doctorInfo.doctor.id) {
        throw new Error("Information du médecin non disponible");
      }
      

      const patientData = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        birth_date: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        email: formData.email || "",
        address: formData.address || "",
        blood_group: formData.bloodGroup || "Unknown",
        mrc_status: formData.mrcStage || "",
        current_treatments: formData.medications?.map((med: any) => 
          ({ name: med.name, dosage: med.dosage, frequency: med.frequency })
        ) || [],
        medical_history: formData.medicalConditions || [],
        antecedents: formData.allergies || [],
        doctor_ref: doctorInfo.doctor.id
      };
      

      const newPatient = await PatientService.registerPatient(patientData);
      
      toast({
        title: "Patient enregistré avec succès",
        description: `${formData.firstName} ${formData.lastName} a été ajouté à votre liste de patients.`,
      });
      
      navigate("/dashboard/patients");
    } catch (error: any) {
      console.error("Error registering patient:", error);
      setSubmitError(error.message || "Une erreur est survenue lors de l'enregistrement du patient");
      
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement du patient",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#021122]">Résumé et confirmation</h2>
        <p className="text-sm text-[#334349]">Vérifiez les informations du patient avant l'enregistrement</p>
      </div>
      
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}
      
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
                <p className="text-sm">{formData.gender === "male" ? "Homme" : formData.gender === "female" ? "Femme" : "Genre invalide"}</p>
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
                <p className="text-sm font-medium">Groupe sanguin</p>
                <p className="text-sm">{formData.bloodGroup || "Non renseigné"}</p>
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
                  <Check className={`h-4 w-4 mr-2 ${formData.consentTreatment ? "text-green-500" : "text-gray-300"}`} />
                  <p className="text-sm">Consentement au traitement</p>
                </div>
                <div className="flex items-center">
                  <Check className={`h-4 w-4 mr-2 ${formData.consentDataSharing ? "text-green-500" : "text-gray-300"}`} />
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
        <Button variant="outline" onClick={onPrevious} className="border-[#91BDC8] text-[#2980BA] hover:bg-[#619DB5] hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        <Button onClick={handleSubmit} disabled={submitting} className="bg-[#2980BA] hover:bg-[#619DB5] text-white">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              Enregistrer le patient
              <Check className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};


const PatientRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({

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
        <h1 className="text-3xl font-bold tracking-tight text-[#021122]">Enregistrer un nouveau patient</h1>
      </div>
      
      <Card className="border-[#91BDC8] shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#ECE7E3] to-[#FAFAFA]">
          <div className="flex items-center space-x-1">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  className={`py-1 px-3 rounded-full text-sm ${
                    currentStep === index + 1 
                      ? "bg-[#2980BA]/20 text-[#2980BA] font-medium" 
                      : currentStep > index + 1 
                      ? "bg-[#2980BA] text-white" 
                      : "bg-[#ECE7E3] text-[#334349]"
                  }`}
                >
                  {index + 1}. {step}
                </div>
                {index < steps.length - 1 && (
                  <div className="h-px w-8 bg-[#91BDC8]" />
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
