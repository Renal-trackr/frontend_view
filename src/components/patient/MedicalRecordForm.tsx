import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MedicalItem {
  id?: string;
  name: string;
  date?: string;
  description?: string;
}

interface MedicalRecordFormProps {
  type: 'treatment' | 'medical_history' | 'antecedent';
  initialItem?: MedicalItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: MedicalItem) => void;
}

const RecordTypeLabels = {
  treatment: {
    title: "Traitement",
    nameLabel: "Nom du traitement",
    namePlaceholder: "Entrez le nom du médicament ou traitement",
    descriptionLabel: "Posologie et instructions",
    descriptionPlaceholder: "Ex: 10mg, 2 fois par jour"
  },
  medical_history: {
    title: "Antécédent médical",
    nameLabel: "Condition",
    namePlaceholder: "Entrez la condition ou le diagnostic",
    descriptionLabel: "Détails",
    descriptionPlaceholder: "Ajouter des détails sur cette condition"
  },
  antecedent: {
    title: "Allergie",
    nameLabel: "Allergène",
    namePlaceholder: "Entrez l'allergène",
    descriptionLabel: "Réaction et sévérité",
    descriptionPlaceholder: "Décrivez la réaction allergique et sa sévérité"
  }
};

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({
  type,
  initialItem = { name: "", date: "", description: "" },
  isOpen,
  onClose,
  onSubmit
}) => {
  const [item, setItem] = useState<MedicalItem>(initialItem);
  const [date, setDate] = useState<Date | undefined>(
    initialItem.date ? new Date(initialItem.date) : undefined
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const labels = RecordTypeLabels[type];
  const isEditing = Boolean(initialItem.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setItem(prev => ({ ...prev, date: format(newDate, 'yyyy-MM-dd') }));
    } else {
      setItem(prev => ({ ...prev, date: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!item.name.trim()) {
      newErrors.name = "Ce champ est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(item);
    }
  };

  const handleReset = () => {
    setItem(initialItem);
    setDate(initialItem.date ? new Date(initialItem.date) : undefined);
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? `Modifier ${labels.title.toLowerCase()}` : `Ajouter ${labels.title.toLowerCase()}`}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? `Mettez à jour les informations de ce ${labels.title.toLowerCase()}`
                : `Ajoutez un nouveau ${labels.title.toLowerCase()} au dossier patient`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{labels.nameLabel} <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                value={item.name}
                onChange={handleChange}
                placeholder={labels.namePlaceholder}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">{labels.descriptionLabel}</Label>
              <Textarea
                id="description"
                name="description"
                value={item.description || ""}
                onChange={handleChange}
                placeholder={labels.descriptionPlaceholder}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleReset}>
              Réinitialiser
            </Button>
            <Button type="submit">
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordForm;
