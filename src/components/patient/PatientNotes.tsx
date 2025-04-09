import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, FileText, Trash2, Edit, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  author: string;
}

interface PatientNotesProps {
  patientId: string;
  patientName: string;
}

const PatientNotes: React.FC<PatientNotesProps> = ({ patientId, patientName }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: "",
    content: "",
    category: "general"
  });
  
  const { toast } = useToast();

  // In a real application, this would fetch from an API
  const fetchNotes = async () => {
    setLoading(true);
    // Simulated API call
    setTimeout(() => {
      setNotes([
        {
          id: "note-1",
          title: "Consultation initiale",
          content: "Premier rendez-vous avec le patient. Symptômes rapportés: fatigue, œdème des membres inférieurs.",
          category: "consultation",
          createdAt: new Date().toISOString(),
          author: "Dr. Richard"
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  React.useEffect(() => {
    fetchNotes();
  }, [patientId]);

  const handleAddNote = () => {
    if (!newNote.title || !newNote.content) {
      toast({
        title: "Champs requis",
        description: "Le titre et le contenu sont obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    const note: Note = {
      ...newNote as any,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      author: "Dr. Richard" // Would come from auth context in a real app
    };
    
    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "", category: "general" });
    setIsAddingNote(false);
    
    toast({
      title: "Note ajoutée",
      description: "La note a été ajoutée avec succès."
    });
  };

  const handleUpdateNote = () => {
    if (!editingNoteId) return;
    
    setNotes(notes.map(note => 
      note.id === editingNoteId ? { ...note, ...newNote } : note
    ));
    
    setEditingNoteId(null);
    setNewNote({ title: "", content: "", category: "general" });
    
    toast({
      title: "Note mise à jour",
      description: "La note a été mise à jour avec succès."
    });
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) {
      setNotes(notes.filter(note => note.id !== id));
      
      toast({
        title: "Note supprimée",
        description: "La note a été supprimée avec succès."
      });
    }
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category
    });
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setNewNote({ title: "", content: "", category: "general" });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "consultation": return "bg-[#2980BA]/10 text-[#2980BA] border-[#2980BA]";
      case "examen": return "bg-[#619DB5]/10 text-[#619DB5] border-[#619DB5]";
      case "traitement": return "bg-[#ECE7E3]/10 text-green-800 border-green-500";
      case "suivi": return "bg-[#91BDC8]/10 text-amber-800 border-amber-500";
      default: return "bg-[#ECE7E3]/10 text-[#334349] border-[#334349]";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy 'à' HH:mm", { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-[#2980BA]">Notes cliniques</CardTitle>
          {!isAddingNote && !editingNoteId && (
            <Button 
              size="sm" 
              onClick={() => setIsAddingNote(true)}
              className="bg-[#2980BA] hover:bg-[#619DB5] text-[#FAFAFA]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle note
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {isAddingNote && (
          <div className="space-y-4 p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-[#021122]">Ajouter une nouvelle note</h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#334349]">Titre <span className="text-red-500">*</span></Label>
                  <Input 
                    id="title" 
                    value={newNote.title} 
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    placeholder="Titre de la note"
                    className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-[#334349]">Catégorie</Label>
                  <Select 
                    value={newNote.category} 
                    onValueChange={(value) => setNewNote({...newNote, category: value})}
                  >
                    <SelectTrigger 
                      id="category"
                      className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                    >
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent className="border-[#91BDC8]">
                      <SelectItem value="general">Général</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="examen">Examen</SelectItem>
                      <SelectItem value="traitement">Traitement</SelectItem>
                      <SelectItem value="suivi">Suivi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="text-[#334349]">Contenu <span className="text-red-500">*</span></Label>
                <Textarea
                  id="content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  placeholder="Contenu de la note..."
                  className="min-h-[150px] border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote({ title: "", content: "", category: "general" });
                  }}
                  className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleAddNote}
                  className="bg-[#2980BA] hover:bg-[#619DB5] text-[#FAFAFA]"
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {editingNoteId && (
          <div className="space-y-4 p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-[#021122]">Modifier la note</h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-[#334349]">Titre <span className="text-red-500">*</span></Label>
                  <Input 
                    id="edit-title" 
                    value={newNote.title} 
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-category" className="text-[#334349]">Catégorie</Label>
                  <Select 
                    value={newNote.category} 
                    onValueChange={(value) => setNewNote({...newNote, category: value})}
                  >
                    <SelectTrigger 
                      id="edit-category"
                      className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                    >
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent className="border-[#91BDC8]">
                      <SelectItem value="general">Général</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="examen">Examen</SelectItem>
                      <SelectItem value="traitement">Traitement</SelectItem>
                      <SelectItem value="suivi">Suivi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-content" className="text-[#334349]">Contenu <span className="text-red-500">*</span></Label>
                <Textarea
                  id="edit-content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  className="min-h-[150px] border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={cancelEditing}
                  className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleUpdateNote}
                  className="bg-[#2980BA] hover:bg-[#619DB5] text-[#FAFAFA]"
                >
                  Mettre à jour
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#2980BA]" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto opacity-20 mb-2 text-[#334349]" />
            <h3 className="font-medium text-lg text-[#021122]">Aucune note</h3>
            <p className="text-[#619DB5]">Ajoutez une nouvelle note pour ce patient</p>
            {!isAddingNote && (
              <Button 
                className="mt-4 bg-[#2980BA] hover:bg-[#619DB5] text-[#FAFAFA]"
                onClick={() => setIsAddingNote(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une note
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="rounded-md p-4 bg-white shadow-sm hover:bg-[#ECE7E3]/10 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-[#021122]">{note.title}</h3>
                    <div className="flex items-center space-x-3 mt-1 text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs border-l-2 ${getCategoryColor(note.category)}`}>
                        {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
                      </span>
                      <span className="text-[#619DB5]">
                        {formatDate(note.createdAt)}
                      </span>
                      <span className="text-[#334349]">
                        {note.author}
                      </span>
                    </div>
                  </div>
                  
                  {!editingNoteId && (
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => startEditing(note)}
                        className="h-8 w-8 text-[#2980BA] hover:bg-[#ECE7E3]/20"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteNote(note.id)}
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 pt-2 border-t border-dashed border-[#91BDC8]/30">
                  <p className="whitespace-pre-wrap text-[#021122]">{note.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientNotes;
