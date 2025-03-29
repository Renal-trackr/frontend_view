import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Users, Pencil, Trash2, CheckCircle, X, AlertCircle } from "lucide-react";
import { Appointment } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AppointmentForm from "@/components/appointment/AppointmentForm";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

// Données fictives pour simulation
const mockPatients = [
  { id: "1", name: "Jean Dupont" },
  { id: "2", name: "Marie Martin" },
  { id: "3", name: "Robert Dubois" },
  { id: "4", name: "Françoise Bernard" },
  { id: "5", name: "Pierre Leroy" },
];

// Rendez-vous d'exemple
const mockAppointments: Appointment[] = [
  {
    id: "appt1",
    patientId: "1",
    date: "27/06/2023",
    time: "10:00",
    duration: 30,
    type: "consultation",
    status: "scheduled",
    notes: "Suivi mensuel",
    doctor: "Dr. Richard"
  },
  {
    id: "appt2",
    patientId: "2",
    date: "28/06/2023",
    time: "14:30",
    duration: 45,
    type: "bilan",
    status: "scheduled",
    notes: "Bilan sanguin complet",
    doctor: "Dr. Richard"
  },
  {
    id: "appt3",
    patientId: "3",
    date: "01/07/2023",
    time: "9:00",
    duration: 30,
    type: "suivi",
    status: "scheduled",
    notes: "",
    doctor: "Dr. Richard"
  },
  {
    id: "appt4",
    patientId: "1",
    date: "15/07/2023",
    time: "11:00",
    duration: 60,
    type: "education",
    status: "scheduled",
    notes: "Session d'éducation thérapeutique",
    doctor: "Dr. Richard"
  }
];

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<"list" | "calendar">("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);

  const handleAddAppointment = (appointment: Partial<Appointment>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `appt-${Date.now()}`,
    } as Appointment;
    
    setAppointments([...appointments, newAppointment]);
    setShowDialog(false);
  };

  const handleUpdateAppointment = (appointment: Partial<Appointment>) => {
    if (!editingAppointment?.id) return;
    
    const updatedAppointments = appointments.map(appt => 
      appt.id === editingAppointment.id ? { ...appt, ...appointment } : appt
    );
    
    setAppointments(updatedAppointments);
    setEditingAppointment(null);
    setShowDialog(false);
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) {
      setAppointments(appointments.filter(appt => appt.id !== id));
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowDialog(true);
  };

  const getPatientName = (patientId: string): string => {
    const patient = mockPatients.find(p => p.id === patientId);
    return patient ? patient.name : "Patient inconnu";
  };

  const getPatientInitials = (patientId: string): string => {
    const name = getPatientName(patientId);
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getAppointmentsByDate = (date: Date) => {
    const formattedDate = format(date, "dd/MM/yyyy");
    return appointments.filter(appt => appt.date === formattedDate);
  };

  const getWeekDays = () => {
    const startDay = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(startDay, i));
  };

  const weekDays = getWeekDays();

  // Filtrage des rendez-vous
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = searchQuery === "" || 
      getPatientName(appointment.patientId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filteredStatus === null || appointment.status === filteredStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAppointment(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau rendez-vous
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {editingAppointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
              </DialogTitle>
              <DialogDescription>
                {editingAppointment
                  ? "Modifiez les informations du rendez-vous existant."
                  : "Programmez un nouveau rendez-vous pour un patient."}
              </DialogDescription>
            </DialogHeader>
            <AppointmentForm
              initialAppointment={editingAppointment || {}}
              patients={mockPatients}
              onSubmit={editingAppointment ? handleUpdateAppointment : handleAddAppointment}
              onCancel={() => {
                setShowDialog(false);
                setEditingAppointment(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
          <TabsList>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="list">
              <Users className="h-4 w-4 mr-2" />
              Liste
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[200px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Statut: {filteredStatus || "Tous"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilteredStatus(null)}>
                Tous
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilteredStatus("scheduled")}>
                Programmés
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilteredStatus("completed")}>
                Terminés
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilteredStatus("cancelled")}>
                Annulés
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={view} className="space-y-4">
        <TabsContent value="calendar" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Calendrier de la semaine</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Aujourd'hui
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
                    Semaine précédente
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
                    Semaine suivante
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, i) => (
                  <div key={i} className="border rounded-md overflow-hidden">
                    <div 
                      className={`p-2 text-center font-medium ${
                        isSameDay(day, new Date()) 
                          ? "bg-primary-100 text-primary-700" 
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="text-xs text-gray-500">{format(day, "EEEE", { locale: fr })}</div>
                      <div>{format(day, "d MMMM", { locale: fr })}</div>
                    </div>
                    <div className="min-h-[200px] p-2">
                      {getAppointmentsByDate(day).map(appointment => (
                        <div 
                          key={appointment.id} 
                          className={`
                            mb-2 p-2 rounded-md text-xs cursor-pointer
                            ${appointment.type === "consultation" ? "bg-primary-50 border-l-4 border-primary-500" : 
                              appointment.type === "bilan" ? "bg-success-50 border-l-4 border-success-500" :
                              appointment.type === "education" ? "bg-warning-50 border-l-4 border-warning-500" :
                              "bg-secondary-50 border-l-4 border-secondary-500"}
                          `}
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">{appointment.time}</span>
                            <span className="capitalize">{appointment.type}</span>
                          </div>
                          <div className="font-medium mt-1">
                            {getPatientName(appointment.patientId)}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {appointment.notes || "Pas de notes"}
                          </div>
                        </div>
                      ))}
                      {getAppointmentsByDate(day).length === 0 && (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">
                          Aucun rendez-vous
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Liste des rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map(appointment => (
                    <div 
                      key={appointment.id} 
                      className="flex items-start justify-between p-3 border rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary-100 text-primary-700">
                            {getPatientInitials(appointment.patientId)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link 
                            to={`/patients/${appointment.patientId}`} 
                            className="font-medium hover:text-primary-600"
                          >
                            {getPatientName(appointment.patientId)}
                          </Link>
                          <div className="flex items-center mt-1 text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{appointment.date}</span>
                            <span className="mx-1">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{appointment.time} ({appointment.duration} min)</span>
                          </div>
                          <div className="flex mt-1">
                            <Badge variant={
                              appointment.type === "consultation" ? "default" :
                              appointment.type === "bilan" ? "success" :
                              appointment.type === "education" ? "warning" :
                              "secondary"
                            }>
                              {appointment.type}
                            </Badge>
                            <Badge 
                              variant={
                                appointment.status === "scheduled" ? "outline" :
                                appointment.status === "completed" ? "success" :
                                "destructive"
                              }
                              className="ml-2"
                            >
                              {appointment.status === "scheduled" ? "Programmé" :
                               appointment.status === "completed" ? "Terminé" :
                               appointment.status === "cancelled" ? "Annulé" : "Manqué"}
                            </Badge>
                          </div>
                          {appointment.notes && (
                            <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          <Trash2 className="h-4 w-4 text-danger-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    Aucun rendez-vous ne correspond à vos critères
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsPage;
