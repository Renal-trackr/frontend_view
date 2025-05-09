import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Users, Pencil, Trash2, CheckCircle, X, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
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
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parseISO, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  getDay
} from "date-fns";
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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleAddAppointment = (appointment: Partial<Appointment>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `appt-${Date.now()}`,
    } as Appointment;
    
    setAppointments([...appointments, newAppointment]);
    setShowDialog(false);
    setSelectedDate(null); // Reset selected date after adding
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

  // Fonction pour générer tous les jours du mois actuel
  const getMonthDays = () => {
    // Obtenir le premier et dernier jour du mois
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // Obtenir le premier jour de la semaine du premier jour du mois
    // et le dernier jour de la semaine du dernier jour du mois
    // pour avoir une grille complète (avec les jours des mois précédent/suivant)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lundi comme premier jour
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    // Générer tous les jours du calendrier
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  // Navigation entre les mois
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Obtenir les jours pour l'affichage du mois
  const monthDays = getMonthDays();

  // Filtrage des rendez-vous
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = searchQuery === "" || 
      getPatientName(appointment.patientId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filteredStatus === null || appointment.status === filteredStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Obtenir les noms des jours de la semaine en français
  const weekDayNames = Array.from({ length: 7 }, (_, i) => {
    const day = (i + 1) % 7; // Pour commencer par lundi (1), puis mar (2), ..., dim (0)
    return format(new Date(2023, 0, day + 2), 'EEEE', { locale: fr });
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#021122]">Rendez-vous</h1>
        <Dialog open={showDialog} onOpenChange={(open) => {
          setShowDialog(open);
          if (!open) {
            setSelectedDate(null); // Reset selected date when closing dialog
          }
        }}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingAppointment(null);
                setSelectedDate(null); // Reset date when opening from main button
              }}
              className="bg-[#2980BA] hover:bg-[#619DB5] text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouveau rendez-vous
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] border-[#91BDC8]">
            <DialogHeader>
              <DialogTitle className="text-[#2980BA]">
                {editingAppointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
              </DialogTitle>
              <DialogDescription className="text-[#334349]">
                {editingAppointment
                  ? "Modifiez les informations du rendez-vous existant."
                  : selectedDate 
                    ? `Programmez un nouveau rendez-vous pour le ${selectedDate}.`
                    : "Programmez un nouveau rendez-vous pour un patient."}
              </DialogDescription>
            </DialogHeader>
            <AppointmentForm
              initialAppointment={{
                ...(editingAppointment || {}),
                ...(selectedDate && !editingAppointment ? { date: selectedDate } : {})
              }}
              patients={mockPatients}
              onSubmit={editingAppointment ? handleUpdateAppointment : handleAddAppointment}
              onCancel={() => {
                setShowDialog(false);
                setEditingAppointment(null);
                setSelectedDate(null);
              }}
              disableDateSelection={!!selectedDate && !editingAppointment}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
          <TabsList className="border-[#91BDC8] bg-[#ECE7E3]/50">
            <TabsTrigger 
              value="calendar" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#2980BA]"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#2980BA]"
            >
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
            className="w-[200px] border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
              >
                Statut: {filteredStatus || "Tous"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-[#91BDC8]">
              <DropdownMenuItem 
                onClick={() => setFilteredStatus(null)}
                className="text-[#021122] focus:bg-[#ECE7E3] focus:text-[#2980BA]"
              >
                Tous
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilteredStatus("scheduled")}
                className="text-[#021122] focus:bg-[#ECE7E3] focus:text-[#2980BA]"
              >
                Programmés
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilteredStatus("completed")}
                className="text-[#021122] focus:bg-[#ECE7E3] focus:text-[#2980BA]"
              >
                Terminés
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilteredStatus("cancelled")}
                className="text-[#021122] focus:bg-[#ECE7E3] focus:text-[#2980BA]"
              >
                Annulés
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={view} className="space-y-4">
        <TabsContent value="calendar" className="mt-0">
          <Card className="border-[#91BDC8] shadow-md">
            <CardHeader className="pb-3 bg-gradient-to-r from-[#ECE7E3] to-[#FAFAFA]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={prevMonth}
                    className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-bold text-[#2980BA]">
                    {format(currentDate, 'MMMM yyyy', { locale: fr })}
                  </h2>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={nextMonth}
                    className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToToday}
                  className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
                >
                  Aujourd'hui
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* En-têtes des jours de la semaine */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDayNames.map((dayName, i) => (
                  <div key={i} className="p-2 text-center font-medium text-[#334349] capitalize">
                    {dayName.substring(0, 3)}
                  </div>
                ))}
              </div>
              
              {/* Grille du calendrier */}
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map((day, i) => (
                  <div 
                    key={i} 
                    className={`border border-[#91BDC8] rounded-md overflow-hidden h-32 ${
                      !isSameMonth(day, currentDate) ? 'bg-[#ECE7E3]/30 opacity-50' : ''
                    } ${
                      isSameDay(day, new Date()) ? 'bg-[#2980BA]/10 border-[#2980BA]' : ''
                    }`}
                  >
                    <div 
                      className={`p-2 text-right text-sm ${
                        isSameDay(day, new Date()) 
                          ? 'font-bold text-[#2980BA]' 
                          : 'text-[#334349]'
                      }`}
                    >
                      {format(day, 'd')}
                    </div>
                    <div className="px-1 overflow-y-auto max-h-[90px]">
                      {getAppointmentsByDate(day).map(appointment => (
                        <div 
                          key={appointment.id} 
                          className={`
                            mb-1 p-1 rounded-md text-xs cursor-pointer
                            ${appointment.type === "consultation" ? "bg-[#2980BA]/10 border-l-2 border-[#2980BA]" : 
                              appointment.type === "bilan" ? "bg-[#619DB5]/10 border-l-2 border-[#619DB5]" :
                              appointment.type === "education" ? "bg-[#91BDC8]/10 border-l-2 border-[#91BDC8]" :
                              "bg-[#ECE7E3] border-l-2 border-[#334349]"}
                          `}
                          onClick={() => handleEditAppointment(appointment)}
                          title={`${appointment.time} - ${getPatientName(appointment.patientId)} - ${appointment.type}`}
                        >
                          <div className="font-medium truncate text-[#021122]">{appointment.time} - {getPatientName(appointment.patientId)}</div>
                        </div>
                      ))}

                      {getAppointmentsByDate(day).length === 0 && isSameMonth(day, currentDate) && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full h-6 text-xs justify-start text-[#619DB5] hover:text-[#2980BA] hover:bg-[#ECE7E3]/20"
                          onClick={() => {
                            setEditingAppointment(null);
                            // Pré-remplir la date pour le nouveau rendez-vous
                            const formattedDate = format(day, "dd/MM/yyyy");
                            setSelectedDate(formattedDate);
                            setShowDialog(true);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Ajouter
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <Card className="border-[#91BDC8] shadow-md">
            <CardHeader className="bg-gradient-to-r from-[#ECE7E3] to-[#FAFAFA]">
              <CardTitle className="text-[#2980BA]">Liste des rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map(appointment => (
                    <div 
                      key={appointment.id} 
                      className="flex items-start justify-between p-3 border border-[#91BDC8] rounded-md hover:bg-[#ECE7E3]/20"
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#2980BA]/20 text-[#2980BA]">
                            {getPatientInitials(appointment.patientId)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link 
                            to={`/dashboard/patients/${appointment.patientId}`} 
                            className="font-medium text-[#021122] hover:text-[#2980BA]"
                          >
                            {getPatientName(appointment.patientId)}
                          </Link>
                          <div className="flex items-center mt-1 text-sm text-[#619DB5]">
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
                            } className={
                              appointment.type === "consultation" 
                                ? "bg-[#2980BA] text-white hover:bg-[#619DB5]" 
                                : appointment.type === "bilan" 
                                ? "bg-[#619DB5] text-white hover:bg-[#91BDC8]" 
                                : appointment.type === "education" 
                                ? "bg-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]" 
                                : ""
                            }>
                              {appointment.type}
                            </Badge>
                            <Badge 
                              variant={
                                appointment.status === "scheduled" ? "outline" :
                                appointment.status === "completed" ? "success" :
                                "destructive"
                              }
                              className={`ml-2 ${
                                appointment.status === "scheduled" 
                                  ? "border-[#91BDC8] text-[#334349]"
                                  : appointment.status === "completed"
                                  ? "bg-[#619DB5] text-white hover:bg-[#2980BA]"
                                  : ""
                              }`}
                            >
                              {appointment.status === "scheduled" ? "Programmé" :
                               appointment.status === "completed" ? "Terminé" :
                               appointment.status === "cancelled" ? "Annulé" : "Manqué"}
                            </Badge>
                          </div>
                          {appointment.notes && (
                            <p className="text-sm text-[#334349] mt-1">{appointment.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditAppointment(appointment)}
                          className="text-[#2980BA] hover:bg-[#ECE7E3]/20"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 text-[#619DB5]">
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
