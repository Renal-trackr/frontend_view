import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MedicalHistoryFormProps {
  initialData: {
    name: string;
    date: string;
    description: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [date, setDate] = useState<Date | undefined>(
    initialData.date ? new Date(initialData.date) : undefined
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (date) {
      setFormData((prev) => ({ ...prev, date: date.toISOString() }));
    }
  }, [date]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-md shadow-sm">
      <h3 className="font-medium text-[#021122]">
        {isEditing ? "Modifier l'affection chronique" : "Ajouter une affection chronique"}
      </h3>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#334349]">
            Nom de l'affection <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Hypertension, Diabète..."
            className={`border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5] ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date" className="text-[#334349]">
            Date de diagnostic
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20",
                  !date && "text-[#619DB5]"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#2980BA]" />
                {date ? (
                  format(date, "PPP", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-[#91BDC8]" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={fr}
                className="border-[#91BDC8]"
                classNames={{
                  day_selected: "bg-[#2980BA] text-white hover:bg-[#619DB5]",
                  day_today: "bg-[#ECE7E3] text-[#334349]"
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-[#334349]">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Détails sur l'affection..."
            className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            className="bg-[#2980BA] hover:bg-[#619DB5] text-white"
          >
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MedicalHistoryForm;
