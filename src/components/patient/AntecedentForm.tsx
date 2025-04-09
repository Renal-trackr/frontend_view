import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AntecedentFormProps {
  initialData: {
    name: string;
    date: string;
    description: string;
    severity?: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const AntecedentForm: React.FC<AntecedentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing,
}) => {
  const [formData, setFormData] = useState({
    ...initialData,
    severity: initialData.severity || "moderate"
  });
  
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
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      <div className="flex items-center space-x-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h3 className="font-medium text-[#021122]">
          {isEditing ? "Modifier l'allergie" : "Ajouter une allergie"}
        </h3>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#334349]">
            Nom de l'allergie <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Pénicilline, Arachides..."
            className={`border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5] ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-[#334349]">
              Date de découverte
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
            <Label htmlFor="severity" className="text-[#334349]">
              Sévérité
            </Label>
            <Select
              value={formData.severity}
              onValueChange={(value) => handleSelectChange("severity", value)}
            >
              <SelectTrigger 
                id="severity"
                className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
              >
                <SelectValue placeholder="Sélectionner la sévérité" />
              </SelectTrigger>
              <SelectContent className="border-[#91BDC8]">
                <SelectItem value="mild">Légère</SelectItem>
                <SelectItem value="moderate">Modérée</SelectItem>
                <SelectItem value="severe">Sévère</SelectItem>
                <SelectItem value="life_threatening">Mortelle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-[#334349]">
            Description et réactions
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez les réactions allergiques et autres informations importantes..."
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

export default AntecedentForm;
