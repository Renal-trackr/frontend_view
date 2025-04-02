import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Calendar, Save, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import PatientService from "@/services/PatientService";
import AuthService from "@/services/AuthService";

interface PatientNote {
  id: string;
  text: string;
  date: string;
  created_by?: string;
}

interface PatientNotesProps {
  patientId: string;
  initialNotes: PatientNote[];
}

const PatientNotes: React.FC<PatientNotesProps> = ({ patientId, initialNotes = [] }) => {
  const [notes, setNotes] = useState<PatientNote[]>(initialNotes);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [editNoteText, setEditNoteText] = useState("");
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;
    
    setLoading(true);
    try {
      const doctorInfo = AuthService.getDoctorInfo();
      const doctorName = doctorInfo?.doctor 
        ? `Dr. ${doctorInfo.doctor.firstname} ${doctorInfo.doctor.lastname}`
        : "Médecin";
      
      const newNote = {
        text: newNoteText,
        date: new Date().toISOString(),
        created_by: doctorName
      };
      
      const updatedPatient = await PatientService.addNote(patientId, newNote);
      
      // Assuming the response includes the updated notes array with IDs
      setNotes(updatedPatient.notes || []);
      setNewNoteText("");
      setIsAddingNote(false);
      
      toast({
        title: "Note ajoutée",
        description: "La note a été ajoutée avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter la note",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editNoteText.trim()) return;
    
    setLoading(true);
    try {
      const noteToUpdate = notes.find(note => note.id === noteId);
      if (!noteToUpdate) return;
      
      const updatedNote = {
        ...noteToUpdate,
        text: editNoteText,
        // Optionally update date to show it was edited
        // date: new Date().toISOString()
      };
      
      const updatedPatient = await PatientService.updateNote(patientId, noteId, updatedNote);
      
      // Update local state with the response
      setNotes(updatedPatient.notes || []);
      setEditingNoteId(null);
      
      toast({
        title: "Note mise à jour",
        description: "La note a été mise à jour avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la note",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;
    
    setLoading(true);
    try {
      const updatedPatient = await PatientService.removeNote(patientId, noteToDelete);
      
      // Update local state
      setNotes(updatedPatient.notes || []);
      setNoteToDelete(null);
      
      toast({
        title: "Note supprimée",
        description: "La note a été supprimée avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la note",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Notes cliniques</CardTitle>
          {!isAddingNote && (
            <Button size="sm" onClick={() => setIsAddingNote(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle note
            </Button>
          )}
        </div>
        <CardDescription>
          {notes.length === 0 
            ? "Aucune note dans le dossier" 
            : `${notes.length} note${notes.length > 1 ? 's' : ''}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
        {isAddingNote && (
          <div className="border rounded-md p-4 bg-gray-50">
            <Textarea
              placeholder="Saisissez votre note clinique ici..."
              rows={4}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
            />
            <div className="flex justify-end space-x-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNoteText("");
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
              <Button 
                size="sm" 
                onClick={handleAddNote}
                disabled={!newNoteText.trim() || loading}
              >
                <Save className="h-4 w-4 mr-1" />
                Enregistrer
              </Button>
            </div>
          </div>
        )}
        
        {notes.length === 0 && !isAddingNote ? (
          <div className="text-center py-8 text-gray-500">
            Aucune note disponible pour ce patient
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="border rounded-md p-4">
              {editingNoteId === note.id ? (
                <>
                  <Textarea
                    rows={4}
                    value={editNoteText}
                    onChange={(e) => setEditNoteText(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditingNoteId(null)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Annuler
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateNote(note.id)}
                      disabled={!editNoteText.trim() || loading}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Mettre à jour
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(note.date)}
                      {note.created_by && <span className="ml-1">par {note.created_by}</span>}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setEditingNoteId(note.id);
                          setEditNoteText(note.text);
                        }}
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setNoteToDelete(note.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <p className="text-sm whitespace-pre-line">{note.text}</p>
                </>
              )}
            </div>
          ))
        )}
      </CardContent>
      
      <AlertDialog 
        open={noteToDelete !== null} 
        onOpenChange={(open) => {
          if (!open) setNoteToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default PatientNotes;
