import React, { useState } from "react";
import { User, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface WorkflowPatientsListProps {
  workflowId: string;
  patientIds: string[];
  allPatients: any[];
  onViewPatient: (patientId: string) => void;
  onAssignPatients: (workflowId: string, patientIds: string[]) => Promise<void>;
  getPatientName: (patientId: string) => string;
}

const WorkflowPatientsList: React.FC<WorkflowPatientsListProps> = ({
  workflowId,
  patientIds,
  allPatients,
  onViewPatient,
  onAssignPatients,
  getPatientName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  const handleAssignPatients = async () => {
    if (selectedPatients.length === 0) return;
    
    try {
      // Mise à jour pour passer les patients_ids au backend
      await onAssignPatients(workflowId, selectedPatients);
      setShowAssignDialog(false);
      setSelectedPatients([]);
    } catch (error) {
      console.error("Failed to assign patients", error);
    }
  };

  const togglePatientSelection = (patientId: string) => {
    setSelectedPatients(prev => 
      prev.includes(patientId)
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  return (
    <>
      {patientIds.length > 1 ? (
        <div>
          <div className="flex items-center mb-1">
            <Badge className="mr-2 border-[#91BDC8] bg-[#91BDC8]/10 text-[#334349]">{patientIds.length} patients</Badge>
            <CollapsibleTrigger 
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-[#ECE7E3]/50 rounded-full"
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-[#619DB5]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#619DB5]" />
              )}
            </CollapsibleTrigger>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto h-6 text-xs text-[#2980BA] hover:text-[#619DB5] hover:bg-[#ECE7E3]/20"
              onClick={() => setShowAssignDialog(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Assigner
            </Button>
          </div>
          
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleContent>
              <div className="space-y-1 mt-2 pl-2 border-l-2 border-[#91BDC8]/30">
                {patientIds.map(patientId => (
                  <Button
                    key={patientId}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-7 text-xs text-[#334349] hover:text-[#2980BA] hover:bg-[#ECE7E3]/20"
                    onClick={() => onViewPatient(patientId)}
                  >
                    <User className="h-3 w-3 mr-1 text-[#619DB5]" />
                    {getPatientName(patientId)}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ) : patientIds.length === 1 ? (
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-[#334349] hover:text-[#2980BA] hover:bg-[#ECE7E3]/20"
            onClick={() => onViewPatient(patientIds[0])}
          >
            <User className="h-4 w-4 mr-1 text-[#619DB5]" />
            {getPatientName(patientIds[0])}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs text-[#2980BA] hover:text-[#619DB5] hover:bg-[#ECE7E3]/20"
            onClick={() => setShowAssignDialog(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Assigner
          </Button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <span className="text-[#334349]">Aucun patient</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs text-[#2980BA] hover:text-[#619DB5] hover:bg-[#ECE7E3]/20"
            onClick={() => setShowAssignDialog(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Assigner
          </Button>
        </div>
      )}

      {/* Dialog to assign more patients */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-[500px] bg-[#FAFAFA] border-[#91BDC8]">
          <DialogHeader>
            <DialogTitle className="text-[#021122]">Assigner des patients au workflow</DialogTitle>
            <DialogDescription className="text-[#334349]">
              Sélectionnez les patients à qui vous souhaitez assigner ce workflow.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[400px] overflow-y-auto pr-2">
            {allPatients
              .filter(patient => !patientIds.includes(patient._id))
              .map(patient => (
                <div key={patient._id} className="flex items-center py-2 border-b border-[#91BDC8]/20 last:border-b-0">
                  <Checkbox
                    checked={selectedPatients.includes(patient._id)}
                    onCheckedChange={() => togglePatientSelection(patient._id)}
                    className="mr-3 border-[#91BDC8] data-[state=checked]:bg-[#2980BA] data-[state=checked]:border-[#2980BA]"
                  />
                  <div className="flex items-center flex-1">
                    <div className="h-6 w-6 rounded-full bg-[#2980BA]/10 flex items-center justify-center text-[#2980BA] font-bold mr-2 text-xs">
                      {patient.firstname[0]}{patient.lastname[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#021122]">{patient.firstname} {patient.lastname}</p>
                      <p className="text-xs text-[#334349]">Stade MRC: {patient.mrc_status || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowAssignDialog(false)}
              className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleAssignPatients} 
              disabled={selectedPatients.length === 0}
              className="bg-[#2980BA] hover:bg-[#619DB5] text-[#FAFAFA]"
            >
              Assigner ({selectedPatients.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkflowPatientsList;
