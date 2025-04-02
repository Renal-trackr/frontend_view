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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Beaker, Users } from "lucide-react";

interface SimplifiedWorkflowFormProps {
  patientId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isTemplate?: boolean;
  selectedPatientsCount?: number;
}

const SimplifiedWorkflowForm: React.FC<SimplifiedWorkflowFormProps> = ({
  patientId,
  onSubmit,
  onCancel,
  isTemplate = false,
  selectedPatientsCount = 0,
}) => {
  // Basic info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // Test settings
  const [testType, setTestType] = useState("urea");
  const [testDescription, setTestDescription] = useState("");
  const [delayDays, setDelayDays] = useState("7");
  
  // Alert condition
  const [alertParameter, setAlertParameter] = useState("value");
  const [alertOperator, setAlertOperator] = useState(">");
  const [alertThreshold, setAlertThreshold] = useState("");
  const [alertUnit, setAlertUnit] = useState("mg/dL");
  
  // Urgent action
  const [scheduleAppointment, setScheduleAppointment] = useState(true);
  const [appointmentMessage, setAppointmentMessage] = useState("Rendez-vous urgent suite à des résultats anormaux");
  const [urgencyLevel, setUrgencyLevel] = useState("high");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const workflowData = {
      name,
      patient_id: patientId,
      test: {
        type: testType,
        description: testDescription,
        delay_days: parseInt(delayDays, 10)
      },
      alert_condition: {
        parameter: alertParameter,
        operator: alertOperator,
        threshold: parseFloat(alertThreshold),
        unit: alertUnit
      },
      urgent_action: {
        schedule_appointment: scheduleAppointment,
        message: appointmentMessage,
        urgency_level: urgencyLevel
      }
    };
    
    onSubmit(workflowData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {isTemplate && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <Users className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Workflow à assigner à plusieurs patients</h3>
                <p className="text-sm text-blue-600">
                  Ce workflow sera assigné à {selectedPatientsCount} patient(s) sélectionné(s).
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <Alert>
            <Beaker className="h-4 w-4" />
            <AlertTitle>Workflow simplifié</AlertTitle>
            <AlertDescription>
              Ce formulaire vous permet de créer rapidement un workflow basé sur un test médical et des seuils d'alerte.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nom du workflow</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Suivi du taux d'urée"
              required
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Configuration du test</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="test-type">Type de test</Label>
              <Select value={testType} onValueChange={setTestType}>
                <SelectTrigger id="test-type">
                  <SelectValue placeholder="Sélectionner le type de test" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urea">Urée</SelectItem>
                  <SelectItem value="creatinine">Créatinine</SelectItem>
                  <SelectItem value="egfr">DFG (eGFR)</SelectItem>
                  <SelectItem value="potassium">Potassium</SelectItem>
                  <SelectItem value="sodium">Sodium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delay-days">Délai avant le test (jours)</Label>
              <Input
                id="delay-days"
                type="number"
                min="1"
                value={delayDays}
                onChange={(e) => setDelayDays(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="test-description">Description du test</Label>
            <Textarea
              id="test-description"
              value={testDescription}
              onChange={(e) => setTestDescription(e.target.value)}
              placeholder="Instructions ou détails sur le test à réaliser"
              rows={2}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Condition d'alerte</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alert-parameter">Paramètre</Label>
              <Select value={alertParameter} onValueChange={setAlertParameter}>
                <SelectTrigger id="alert-parameter">
                  <SelectValue placeholder="Sélectionner le paramètre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="value">Valeur</SelectItem>
                  <SelectItem value="ratio">Ratio</SelectItem>
                  <SelectItem value="concentration">Concentration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alert-operator">Condition</Label>
              <Select value={alertOperator} onValueChange={setAlertOperator}>
                <SelectTrigger id="alert-operator">
                  <SelectValue placeholder="Sélectionner l'opérateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=">">Supérieur à</SelectItem>
                  <SelectItem value="<">Inférieur à</SelectItem>
                  <SelectItem value="==">Égal à</SelectItem>
                  <SelectItem value=">=">Supérieur ou égal à</SelectItem>
                  <SelectItem value="<=">Inférieur ou égal à</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alert-threshold">Seuil</Label>
              <div className="flex">
                <Input
                  id="alert-threshold"
                  type="number"
                  step="0.01"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="flex-1 rounded-r-none"
                  required
                />
                <Select value={alertUnit} onValueChange={setAlertUnit}>
                  <SelectTrigger className="w-24 rounded-l-none border-l-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg/dL">mg/dL</SelectItem>
                    <SelectItem value="mmol/L">mmol/L</SelectItem>
                    <SelectItem value="mL/min">mL/min</SelectItem>
                    <SelectItem value="mmHg">mmHg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Alert className="bg-amber-50 text-amber-800 border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Condition d'alerte</AlertTitle>
            <AlertDescription>
              Une alerte sera déclenchée si {testType} a une {alertParameter} {alertOperator} {alertThreshold} {alertUnit}
            </AlertDescription>
          </Alert>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Action urgente</h3>
            <div className="flex items-center space-x-2">
              <Switch
                checked={scheduleAppointment}
                onCheckedChange={setScheduleAppointment}
                id="schedule-appointment"
              />
              <Label htmlFor="schedule-appointment">Planifier un rendez-vous</Label>
            </div>
          </div>
          
          {scheduleAppointment && (
            <>
              <div className="space-y-2">
                <Label htmlFor="urgency-level">Niveau d'urgence</Label>
                <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                  <SelectTrigger id="urgency-level">
                    <SelectValue placeholder="Sélectionner le niveau d'urgence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="appointment-message">Message pour le rendez-vous</Label>
                <Textarea
                  id="appointment-message"
                  value={appointmentMessage}
                  onChange={(e) => setAppointmentMessage(e.target.value)}
                  placeholder="Message expliquant la raison du rendez-vous urgent"
                  rows={2}
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 py-3 pt-4 bg-white mt-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Créer le workflow
        </Button>
      </div>
    </form>
  );
};

export default SimplifiedWorkflowForm;
