import React, { useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, CalendarClock, Activity, Pill, Microscope } from "lucide-react";
import { MRCStage, Workflow, WorkflowTask } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

// Initial empty task template
const emptyTask: WorkflowTask = {
  id: "",
  name: "",
  type: "test",
  frequency: "",
  description: "",
  alertThresholds: [], // Ajout des seuils d'alerte
  reminderDays: 3, // Jours avant pour le rappel
};

// Initial empty workflow template
const emptyWorkflow: Workflow = {
  id: "",
  name: "",
  description: "",
  mrcStage: MRCStage.STAGE_1,
  tasks: [],
};

interface WorkflowFormProps {
  initialWorkflow?: Workflow;
  onSubmit: (workflow: Workflow) => void;
  onCancel: () => void;
}

const WorkflowForm: React.FC<WorkflowFormProps> = ({
  initialWorkflow = emptyWorkflow,
  onSubmit,
  onCancel,
}) => {
  const [workflow, setWorkflow] = useState<Workflow>({
    ...initialWorkflow,
    id: initialWorkflow.id || `wf-${Date.now()}`,
  });
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState<WorkflowTask>(emptyTask);
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);

  const handleWorkflowChange = (field: keyof Workflow, value: any) => {
    setWorkflow({ ...workflow, [field]: value });
  };

  const handleTaskChange = (field: keyof WorkflowTask, value: any) => {
    setCurrentTask({ ...currentTask, [field]: value });
  };

  const handleThresholdChange = (index: number, field: string, value: any) => {
    const updatedThresholds = [...(currentTask.alertThresholds || [])];

    if (!updatedThresholds[index]) {
      updatedThresholds[index] = { metric: "", min: undefined, max: undefined };
    }

    updatedThresholds[index] = {
      ...updatedThresholds[index],
      [field]: value,
    };

    setCurrentTask({
      ...currentTask,
      alertThresholds: updatedThresholds,
    });
  };

  const addThreshold = () => {
    setCurrentTask({
      ...currentTask,
      alertThresholds: [...(currentTask.alertThresholds || []), { metric: "", min: undefined, max: undefined }],
    });
  };

  const removeThreshold = (index: number) => {
    const updatedThresholds = [...(currentTask.alertThresholds || [])];
    updatedThresholds.splice(index, 1);
    setCurrentTask({
      ...currentTask,
      alertThresholds: updatedThresholds,
    });
  };

  const addOrUpdateTask = () => {
    const taskWithId = {
      ...currentTask,
      id: currentTask.id || `task-${Date.now()}`,
    };

    let updatedTasks;
    if (editingTaskIndex !== null) {
      updatedTasks = [...workflow.tasks];
      updatedTasks[editingTaskIndex] = taskWithId;
    } else {
      updatedTasks = [...workflow.tasks, taskWithId];
    }

    setWorkflow({ ...workflow, tasks: updatedTasks });
    setShowTaskDialog(false);
    setCurrentTask(emptyTask);
    setEditingTaskIndex(null);
  };

  const editTask = (index: number) => {
    setCurrentTask(workflow.tasks[index]);
    setEditingTaskIndex(index);
    setShowTaskDialog(true);
  };

  const removeTask = (index: number) => {
    const updatedTasks = workflow.tasks.filter((_, i) => i !== index);
    setWorkflow({ ...workflow, tasks: updatedTasks });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(workflow);
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <CalendarClock className="h-4 w-4" />;
      case "medication":
        return <Pill className="h-4 w-4" />;
      case "test":
        return <Microscope className="h-4 w-4" />;
      case "monitoring":
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du workflow</Label>
            <Input
              id="name"
              value={workflow.name}
              onChange={(e) => handleWorkflowChange("name", e.target.value)}
              required
              placeholder="Ex: Suivi standard MRC stade 2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={workflow.description}
              onChange={(e) => handleWorkflowChange("description", e.target.value)}
              placeholder="Décrivez l'objectif et l'utilisation de ce workflow"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mrcStage">Stade MRC applicable</Label>
            <Select
              value={workflow.mrcStage}
              onValueChange={(value) => handleWorkflowChange("mrcStage", value)}
            >
              <SelectTrigger id="mrcStage">
                <SelectValue placeholder="Sélectionner un stade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MRCStage.STAGE_1}>Stade 1</SelectItem>
                <SelectItem value={MRCStage.STAGE_2}>Stade 2</SelectItem>
                <SelectItem value={MRCStage.STAGE_3A}>Stade 3A</SelectItem>
                <SelectItem value={MRCStage.STAGE_3B}>Stade 3B</SelectItem>
                <SelectItem value={MRCStage.STAGE_4}>Stade 4</SelectItem>
                <SelectItem value={MRCStage.STAGE_5}>Stade 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Tâches du workflow</Label>
            <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setCurrentTask(emptyTask);
                    setEditingTaskIndex(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une tâche
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingTaskIndex !== null
                      ? "Modifier la tâche"
                      : "Ajouter une nouvelle tâche"}
                  </DialogTitle>
                  <DialogDescription>
                    Définissez les détails de la tâche pour ce workflow.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="taskName">Nom de la tâche</Label>
                    <Input
                      id="taskName"
                      value={currentTask.name}
                      onChange={(e) => handleTaskChange("name", e.target.value)}
                      placeholder="Ex: Analyse de créatinine"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taskType">Type de tâche</Label>
                    <Select
                      value={currentTask.type}
                      onValueChange={(value) => handleTaskChange("type", value)}
                    >
                      <SelectTrigger id="taskType">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="test">Analyse</SelectItem>
                        <SelectItem value="appointment">Rendez-vous</SelectItem>
                        <SelectItem value="medication">Médicament</SelectItem>
                        <SelectItem value="monitoring">Surveillance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taskFrequency">Fréquence</Label>
                    <Input
                      id="taskFrequency"
                      value={currentTask.frequency}
                      onChange={(e) => handleTaskChange("frequency", e.target.value)}
                      placeholder="Ex: Tous les 3 mois"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taskDescription">Description</Label>
                    <Textarea
                      id="taskDescription"
                      value={currentTask.description}
                      onChange={(e) => handleTaskChange("description", e.target.value)}
                      placeholder="Description détaillée de la tâche"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminderDays">Rappel (jours avant)</Label>
                    <Input
                      id="reminderDays"
                      type="number"
                      min="0"
                      value={currentTask.reminderDays}
                      onChange={(e) => handleTaskChange("reminderDays", parseInt(e.target.value))}
                      placeholder="Jours avant l'échéance"
                    />
                    <p className="text-xs text-gray-500">Envoyer un rappel ce nombre de jours avant l'échéance.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Seuils d'alerte</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={addThreshold}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Ajouter un seuil
                      </Button>
                    </div>

                    {currentTask.alertThresholds && currentTask.alertThresholds.length > 0 ? (
                      <div className="space-y-3 border rounded-md p-3">
                        {currentTask.alertThresholds.map((threshold, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-5">
                              <Select
                                value={threshold.metric}
                                onValueChange={(value) => handleThresholdChange(index, "metric", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Paramètre" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="crea">Créatinine</SelectItem>
                                  <SelectItem value="egfr">DFG estimé</SelectItem>
                                  <SelectItem value="potassium">Potassium</SelectItem>
                                  <SelectItem value="hb">Hémoglobine</SelectItem>
                                  <SelectItem value="bloodPressure">Tension artérielle</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-3">
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="Min"
                                value={threshold.min !== undefined ? threshold.min : ''}
                                onChange={(e) => handleThresholdChange(index, "min", e.target.value ? parseFloat(e.target.value) : undefined)}
                              />
                            </div>
                            <div className="col-span-3">
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="Max"
                                value={threshold.max !== undefined ? threshold.max : ''}
                                onChange={(e) => handleThresholdChange(index, "max", e.target.value ? parseFloat(e.target.value) : undefined)}
                              />
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeThreshold(index)}
                              >
                                <Trash2 className="h-4 w-4 text-danger-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <p className="text-xs text-gray-500 mt-2">
                          Définissez les seuils qui déclencheront des alertes lorsqu'ils sont dépassés.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center border border-dashed rounded-md p-3 text-sm text-gray-500">
                        Aucun seuil d'alerte défini. Ajoutez-en pour être alerté en cas d'anomalie.
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTaskDialog(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="button" onClick={addOrUpdateTask}>
                    {editingTaskIndex !== null ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {workflow.tasks.length === 0 ? (
            <div className="border border-dashed rounded-lg p-6 text-center text-gray-500">
              Aucune tâche ajoutée. Cliquez sur "Ajouter une tâche" pour commencer.
            </div>
          ) : (
            <div className="space-y-3">
              {workflow.tasks.map((task, index) => (
                <div
                  key={task.id || index}
                  className="border rounded-lg p-3 flex justify-between items-start"
                >
                  <div className="flex items-start">
                    <div className="bg-secondary-50 p-2 rounded-full mr-3">
                      {getTaskIcon(task.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{task.name}</h4>
                      <p className="text-xs text-gray-500">{task.description}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {task.type === "test"
                            ? "Analyse"
                            : task.type === "appointment"
                            ? "Rendez-vous"
                            : task.type === "medication"
                            ? "Médicament"
                            : "Surveillance"}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {task.frequency}
                        </Badge>
                        {task.alertThresholds && task.alertThresholds.length > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {task.alertThresholds.length} alerte(s)
                          </Badge>
                        )}
                        {task.reminderDays > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Rappel: {task.reminderDays}j avant
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => editTask(index)}
                    >
                      Modifier
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTask(index)}
                    >
                      <Trash2 className="h-4 w-4 text-danger-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={workflow.name === "" || workflow.tasks.length === 0}>
          Enregistrer le workflow
        </Button>
      </div>
    </form>
  );
};

export default WorkflowForm;
