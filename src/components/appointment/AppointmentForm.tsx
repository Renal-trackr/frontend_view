import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Appointment } from "@/lib/types";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AppointmentFormProps {
  initialAppointment?: Partial<Appointment>;
  patients?: { id: string; name: string }[];
  selectedPatientId?: string;
  onSubmit: (appointment: Partial<Appointment>) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialAppointment = {},
  patients = [],
  selectedPatientId,
  onSubmit,
  onCancel,
}) => {
  const [appointment, setAppointment] = useState<Partial<Appointment>>({
    patientId: selectedPatientId || "",
    date: "",
    time: "",
    duration: 30,
    type: "consultation",
    status: "scheduled",
    notes: "",
    doctor: "Dr. Richard",
    ...initialAppointment,
  });

  const [date, setDate] = useState<Date | undefined>(
    appointment.date ? new Date(appointment.date.split('/').reverse().join('-')) : undefined
  );

  useEffect(() => {
    if (selectedPatientId && !appointment.patientId) {
      setAppointment(prev => ({ ...prev, patientId: selectedPatientId }));
    }
  }, [selectedPatientId, appointment.patientId]);

  const handleChange = (field: keyof Appointment, value: any) => {
    setAppointment({ ...appointment, [field]: value });
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      const formattedDate = format(newDate, "dd/MM/yyyy");
      handleChange("date", formattedDate);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(appointment);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!selectedPatientId && (
        <div className="space-y-2">
          <Label htmlFor="patient">Patient</Label>
          <Select
            value={appointment.patientId}
            onValueChange={(value) => handleChange("patientId", value)}
          >
            <SelectTrigger id="patient">
              <SelectValue placeholder="Sélectionner un patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
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
          <Label htmlFor="time">Heure</Label>
          <div className="flex items-center">
            <Select
              value={appointment.time}
              onValueChange={(value) => handleChange("time", value)}
            >
              <SelectTrigger id="time" className="w-full">
                <SelectValue placeholder="Sélectionner l'heure" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 11 }, (_, i) => i + 8).map((hour) => (
                  <React.Fragment key={hour}>
                    <SelectItem value={`${hour}:00`}>{`${hour}:00`}</SelectItem>
                    <SelectItem value={`${hour}:30`}>{`${hour}:30`}</SelectItem>
                  </React.Fragment>
                ))}
              </SelectContent>
            </Select>
            <Clock className="ml-2 h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type de rendez-vous</Label>
          <Select
            value={appointment.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="suivi">Suivi</SelectItem>
              <SelectItem value="bilan">Bilan sanguin</SelectItem>
              <SelectItem value="education">Éducation thérapeutique</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Durée (minutes)</Label>
          <Select
            value={appointment.duration.toString()}
            onValueChange={(value) => handleChange("duration", parseInt(value))}
          >
            <SelectTrigger id="duration">
              <SelectValue placeholder="Sélectionner une durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">1 heure</SelectItem>
              <SelectItem value="90">1 heure 30</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={appointment.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Informations supplémentaires concernant ce rendez-vous"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {initialAppointment.id ? "Mettre à jour" : "Créer le rendez-vous"}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
