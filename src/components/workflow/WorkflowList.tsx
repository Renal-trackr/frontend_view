import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  PlayCircle, 
  PauseCircle, 
  CheckCircle, 
  Calendar,
  LayoutList,
  Users
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Workflow, WorkflowStatus } from "@/services/WorkflowService";
import WorkflowForm from "./WorkflowForm";
import { getWorkflowPatientIds } from "@/lib/workflowUtils";

interface WorkflowListProps {
  patientId: string;
  workflows: Workflow[];
  onCreateWorkflow: (workflow: Workflow) => Promise<void>;
  onUpdateWorkflow: (id: string, data: Partial<Workflow>) => Promise<void>;
  onDeleteWorkflow: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, status: WorkflowStatus) => Promise<void>;
}

const WorkflowList: React.FC<WorkflowListProps> = ({
  patientId,
  workflows,
  onCreateWorkflow,
  onUpdateWorkflow,
  onDeleteWorkflow,
  onUpdateStatus,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);

  const handleCreateWorkflow = (workflowData: Workflow) => {
    onCreateWorkflow(workflowData)
      .then(() => setShowCreateForm(false))
      .catch(err => console.error("Error creating workflow:", err));
  };

  const handleUpdateWorkflow = (workflowData: Workflow) => {
    if (!editingWorkflow?._id) return;
    
    onUpdateWorkflow(editingWorkflow._id, workflowData)
      .then(() => {
        setEditingWorkflow(null);
        setShowEditForm(false);
      })
      .catch(err => console.error("Error updating workflow:", err));
  };

  const handleEditClick = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setShowEditForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setWorkflowToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!workflowToDelete) return;
    
    onDeleteWorkflow(workflowToDelete)
      .then(() => {
        setWorkflowToDelete(null);
        setDeleteConfirmOpen(false);
      })
      .catch(err => console.error("Error deleting workflow:", err));
  };

  const getStatusBadge = (status: WorkflowStatus) => {
    switch (status) {
      case WorkflowStatus.ACTIVE:
        return <Badge variant="outline" className="bg-[#91BDC8]/10 text-green-700 border-green-200">Actif</Badge>;
      case WorkflowStatus.PAUSED:
        return <Badge variant="outline" className="bg-[#ECE7E3]/20 text-amber-700 border-amber-200">En pause</Badge>;
      case WorkflowStatus.COMPLETED:
        return <Badge variant="outline" className="bg-[#91BDC8]/10 text-[#2980BA] border-[#91BDC8]">Terminé</Badge>;
      default:
        return <Badge variant="outline" className="text-[#334349] border-[#91BDC8]">Inconnu</Badge>;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#021122]">Workflows assignés</h2>
        <Button onClick={() => setShowCreateForm(true)} className="bg-[#2980BA] hover:bg-[#619DB5] text-[#FAFAFA]">
          <Plus className="mr-2 h-4 w-4" />
          Créer un workflow
        </Button>
      </div>

      {workflows.length === 0 ? (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-[#2980BA]">Aucun workflow</CardTitle>
            <CardDescription className="text-[#334349]">
              Aucun workflow n'est actuellement assigné à ce patient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(true)}
                className="mx-auto border-[#91BDC8] text-[#2980BA] hover:bg-[#ECE7E3]/20"
              >
                <Plus className="mr-2 h-4 w-4" />
                Créer votre premier workflow
              </Button>
              <p className="mt-4 text-sm text-[#334349]">
                Les workflows vous permettent d'automatiser le suivi patient (rappels, alertes, tâches)
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map((workflow) => (
            <Card key={workflow._id} className="shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-[#2980BA]">{workflow.name}</CardTitle>
                    <CardDescription className="text-[#334349]">
                      {getStatusBadge(workflow.status)}
                      <span className="ml-2 text-xs">
                        Créé {formatDistanceToNow(new Date(workflow.created_at), { addSuffix: true, locale: fr })}
                      </span>
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-[#334349] hover:bg-[#ECE7E3]/20 hover:text-[#2980BA]">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-[#91BDC8]">
                      <DropdownMenuItem onClick={() => handleEditClick(workflow)} className="text-[#021122] focus:bg-[#ECE7E3]/20 focus:text-[#2980BA]">
                        <Edit className="mr-2 h-4 w-4 text-[#2980BA]" />
                        Modifier
                      </DropdownMenuItem>
                      
                      {workflow.status === WorkflowStatus.ACTIVE && (
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(workflow._id, WorkflowStatus.PAUSED)}
                          className="text-[#021122] focus:bg-[#ECE7E3]/20 focus:text-[#2980BA]"
                        >
                          <PauseCircle className="mr-2 h-4 w-4 text-[#2980BA]" />
                          Mettre en pause
                        </DropdownMenuItem>
                      )}
                      
                      {workflow.status === WorkflowStatus.PAUSED && (
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(workflow._id, WorkflowStatus.ACTIVE)}
                          className="text-[#021122] focus:bg-[#ECE7E3]/20 focus:text-[#2980BA]"
                        >
                          <PlayCircle className="mr-2 h-4 w-4 text-[#2980BA]" />
                          Reprendre
                        </DropdownMenuItem>
                      )}
                      
                      {workflow.status !== WorkflowStatus.COMPLETED && (
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(workflow._id, WorkflowStatus.COMPLETED)}
                          className="text-[#021122] focus:bg-[#ECE7E3]/20 focus:text-[#2980BA]"
                        >
                          <CheckCircle className="mr-2 h-4 w-4 text-[#2980BA]" />
                          Marquer comme terminé
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteClick(workflow._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#334349] mb-4">
                  {workflow.description}
                </p>
                
                <div className="flex items-center text-sm text-[#619DB5] space-x-3">
                  <div className="flex items-center">
                    <LayoutList className="h-4 w-4 mr-1" />
                    <span>{(workflow.steps?.length || 0)} étapes</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{getWorkflowPatientIds(workflow).length} patient(s)</span>
                  </div>
                  
                  {workflow.status === WorkflowStatus.ACTIVE && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Prochaine étape: -</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Workflow Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau workflow</DialogTitle>
            <DialogDescription>
              Définissez les détails du workflow et ajoutez des étapes
            </DialogDescription>
          </DialogHeader>
          
          <WorkflowForm
            patientId={patientId}
            onSubmit={handleCreateWorkflow}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Workflow Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Modifier le workflow</DialogTitle>
            <DialogDescription>
              Modifiez les détails du workflow ou les étapes
            </DialogDescription>
          </DialogHeader>
          
          <WorkflowForm
            patientId={patientId}
            initialData={editingWorkflow || undefined}
            onSubmit={handleUpdateWorkflow}
            onCancel={() => {
              setEditingWorkflow(null);
              setShowEditForm(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce workflow ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setWorkflowToDelete(null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WorkflowList;
