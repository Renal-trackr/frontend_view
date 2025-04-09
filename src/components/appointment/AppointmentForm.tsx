import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Appointment } from "@/lib/types";

// Import date and time picker components
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Patient {
  id: string;
  name: string;
}

interface AppointmentFormProps {
  initialAppointment: Partial<Appointment>;
  patients?: Patient[];
  selectedPatientId?: string;
  onSubmit: (data: Partial<Appointment>) => void;
  onCancel: () => void;
  disableDateSelection?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialAppointment,
  patients = [],
  selectedPatientId,
  onSubmit,
  onCancel,
  disableDateSelection = false
}) => {
  // Parse initial date if it exists
  const parseInitialDate = () => {
    if (!initialAppointment.date) return undefined;
    
    // Parse from "DD/MM/YYYY" format
    const [day, month, year] = initialAppointment.date.split('/').map(Number);
    if (!day || !month || !year) return undefined;
    
    return new Date(year, month - 1, day);
  };
  
  const [date, setDate] = useState<Date | undefined>(parseInitialDate());
  
  const [formData, setFormData] = useState<Partial<Appointment>>({
    patientId: selectedPatientId || initialAppointment.patientId || "",
    date: initialAppointment.date || "",
    time: initialAppointment.time || "",
    duration: initialAppointment.duration || 30,
    type: initialAppointment.type || "consultation",
    status: initialAppointment.status || "scheduled",
    notes: initialAppointment.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedPatientId) {
      setFormData(prev => ({ ...prev, patientId: selectedPatientId }));
    }
  }, [selectedPatientId]);

  // Update form data when date changes
  useEffect(() => {
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy");
      setFormData(prev => ({ ...prev, date: formattedDate }));
    }
  }, [date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Time selection options for the dropdown
  const timeOptions = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      timeOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.patientId) {
      newErrors.patientId = "Veuillez sélectionner un patient";
    }
    
    if (!formData.date) {
      newErrors.date = "La date est requise";
    }
    
    if (!formData.time) {
      newErrors.time = "L'heure est requise";
    }
    
    if (!formData.type) {
      newErrors.type = "Le type est requis";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patientId" className="text-[#334349]">Patient</Label>
        <Select
          value={formData.patientId}
          onValueChange={(value) => handleSelectChange("patientId", value)}
          disabled={!!selectedPatientId}
        >
          <SelectTrigger 
            id="patientId" 
            className={`border-[#91BDC8] focus:ring-[#619DB5] ${errors.patientId ? "border-red-500" : ""}`}
          >
            <SelectValue placeholder="Sélectionner un patient" />
          </SelectTrigger>
          <SelectContent className="border-[#91BDC8]">
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.patientId && <p className="text-xs text-red-500">{errors.patientId}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-[#334349]">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20",
                  !date && "text-[#619DB5]",
                  errors.date ? "border-red-500" : ""
                )}
                disabled={disableDateSelection}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#2980BA]" />
                {date ? format(date, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
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
          {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Heure</Label>
          <Select
            value={formData.time}
            onValueChange={(value) => handleSelectChange("time", value)}
          >
            <SelectTrigger id="time" className={errors.time ? "border-red-500" : ""}>
              <SelectValue placeholder="Sélectionner une heure">
                {formData.time || <span className="text-muted-foreground">Sélectionner une heure</span>}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Durée (minutes)</Label>
          <Select
            value={formData.duration?.toString()}
            onValueChange={(value) => handleSelectChange("duration", value)}
          >
            <SelectTrigger id="duration">
              <SelectValue placeholder="Sélectionner la durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">1 heure</SelectItem>
              <SelectItem value="90">1 heure 30</SelectItem>
              <SelectItem value="120">2 heures</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger id="type" className={errors.type ? "border-red-500" : ""}>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="bilan">Bilan</SelectItem>
              <SelectItem value="suivi">Suivi</SelectItem>
              <SelectItem value="education">Éducation thérapeutique</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Informations supplémentaires"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
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
          {initialAppointment.id ? "Mettre à jour" : "Créer le rendez-vous"}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
