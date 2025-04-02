import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { WorkflowStep, WorkflowStepType, TimingType } from "@/services/WorkflowService";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Ajouter de nouveaux types d'étapes
export enum AdvancedStepType {
  MEDICAL_TEST = 'analysis_test',
  APPOINTMENT = 'appointment',
  REMINDER = 'reminder',
  TASK = 'task',
  ALERT = 'alert'
}

interface WorkflowStepFormProps {
  initialData?: Partial<WorkflowStep>;
  onSubmit: (data: WorkflowStep) => void;
  onCancel: () => void;
  stepIndex: number;
}

const WorkflowStepForm: React.FC<WorkflowStepFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  stepIndex,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [stepType, setStepType] = useState(initialData?.type || WorkflowStepType.TASK);
  const [timingType, setTimingType] = useState(initialData?.condition?.timing?.type || TimingType.DELAY);
  const [timingValue, setTimingValue] = useState(initialData?.condition?.timing?.value || "1d");
  const [date, setDate] = useState<Date | undefined>(
    initialData?.condition?.timing?.date ? new Date(initialData.condition.timing.date) : undefined
  );
  const [actionType, setActionType] = useState(initialData?.action?.type || "schedule_appointment");
  const [actionReason, setActionReason] = useState(initialData?.action?.reason || "");
  const [actionMessage, setActionMessage] = useState(initialData?.action?.message || "");
  const [showTestCondition, setShowTestCondition] = useState(
    !!initialData?.condition?.testResult
  );
  const [testType, setTestType] = useState(
    initialData?.condition?.testResult?.type || "urea"
  );
  const [testOperator, setTestOperator] = useState(
    initialData?.condition?.testResult?.operator || ">"
  );
  const [testValue, setTestValue] = useState(
    initialData?.condition?.testResult?.value?.toString() || ""
  );
  const [testUnit, setTestUnit] = useState(
    initialData?.condition?.testResult?.unit || "mg/dL"
  );

  // Nouveaux états pour les types d'étapes avancés
  const [advancedStepType, setAdvancedStepType] = useState<string>(
    initialData?.type === 'analysis_test' ? 'analysis_test' : (initialData?.type || 'reminder')
  );

  // État pour les tests médicaux
  const [testMedicalType, setTestMedicalType] = useState(
    initialData?.action?.test_type || "urea"
  );

  // États pour les conditions de dépendance
  const [hasDependency, setHasDependency] = useState(
    !!initialData?.condition?.dependsOn
  );
  const [dependsOnStep, setDependsOnStep] = useState<number>(
    initialData?.condition?.dependsOn || 0
  );

  // État pour les résultats attendus
  const [expectedOutcome, setExpectedOutcome] = useState(
    initialData?.condition?.outcome || "normal"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Type spécial pour les tests médicaux
    let finalStepType = stepType as WorkflowStepType;
    if (advancedStepType === 'analysis_test') {
      finalStepType = 'analysis_test' as any;
    }

    const step: WorkflowStep = {
      name,
      description,
      order: stepIndex + 1,
      type: finalStepType,
      condition: {
        timing: {
          type: timingType as TimingType,
          value: timingValue,
          ...(date ? { date: date.toISOString() } : {})
        }
      },
      action: {
        type: actionType,
        reason: actionReason,
        message: actionMessage
      }
    };

    // Ajouter la condition de test si elle est activée
    if (showTestCondition && testType && testOperator && testValue) {
      step.condition.testResult = {
        type: testType,
        operator: testOperator as any,
        value: parseFloat(testValue),
        unit: testUnit
      };
    }

    // Ajouter les données spécifiques aux tests médicaux
    if (advancedStepType === 'analysis_test') {
      step.action.test_type = testMedicalType;
      step.action.requires_result = true;
    }

    // Ajouter la dépendance si elle est activée
    if (hasDependency && dependsOnStep > 0) {
      step.condition.dependsOn = dependsOnStep;
      step.condition.outcome = expectedOutcome;
    }

    if (initialData && initialData._id) {
      step._id = initialData._id;
    }

    onSubmit(step);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de l'étape</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Rappel de rendez-vous"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détails sur cette étape du workflow"
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stepType">Type d'étape</Label>
          <Select 
            value={advancedStepType} 
            onValueChange={(v) => {
              setAdvancedStepType(v);
              // Mettre à jour le type standard si nécessaire
              if (['reminder', 'task', 'alert'].includes(v)) {
                setStepType(v as WorkflowStepType);
              }
            }}
          >
            <SelectTrigger className="w-full" id="stepType">
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AdvancedStepType.REMINDER}>Rappel</SelectItem>
              <SelectItem value={AdvancedStepType.TASK}>Tâche</SelectItem>
              <SelectItem value={AdvancedStepType.ALERT}>Alerte</SelectItem>
              <SelectItem value={AdvancedStepType.MEDICAL_TEST}>Test médical</SelectItem>
              <SelectItem value={AdvancedStepType.APPOINTMENT}>Rendez-vous</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timingType">Timing de l'étape</Label>
          <Select value={timingType} onValueChange={setTimingType}>
            <SelectTrigger className="w-full" id="timingType">
              <SelectValue placeholder="Quand exécuter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TimingType.DELAY}>Délai après l'étape précédente</SelectItem>
              <SelectItem value={TimingType.FIXED_TIME}>Date et heure spécifiques</SelectItem>
            </SelectContent>
          </Select>

          {timingType === TimingType.DELAY && (
            <div className="pt-2">
              <Label htmlFor="timingValue">Délai</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="timingValue"
                  value={timingValue}
                  onChange={(e) => setTimingValue(e.target.value)}
                  placeholder="Ex: 7d"
                />
                <span className="text-sm text-gray-500">d (jours), h (heures), m (minutes)</span>
              </div>
            </div>
          )}

          {timingType === TimingType.FIXED_TIME && (
            <div className="pt-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !date && "text-muted-foreground"
                    )}
                    type="button">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {advancedStepType === AdvancedStepType.MEDICAL_TEST && (
          <div className="space-y-5 p-4 border rounded-md bg-blue-50/30">
            <h3 className="font-medium text-blue-800">Détails du test médical</h3>
            
            <div className="space-y-2">
              <Label htmlFor="test-medical-type">Type de test</Label>
              <Select value={testMedicalType} onValueChange={setTestMedicalType}>
                <SelectTrigger id="test-medical-type">
                  <SelectValue placeholder="Sélectionner le type de test" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urea">Urée</SelectItem>
                  <SelectItem value="creatinine">Créatinine</SelectItem>
                  <SelectItem value="egfr">DFG (eGFR)</SelectItem>
                  <SelectItem value="potassium">Potassium</SelectItem>
                  <SelectItem value="sodium">Sodium</SelectItem>
                  <SelectItem value="glucose">Glucose</SelectItem>
                  <SelectItem value="albumin">Albumine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="test-condition">Définir des conditions sur le résultat</Label>
                <Switch
                  id="test-condition"
                  checked={showTestCondition}
                  onCheckedChange={setShowTestCondition}
                />
              </div>
              
              {showTestCondition && (
                <div className="space-y-4 mt-3 p-4 bg-white border rounded-md">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="test-operator">Si le résultat est</Label>
                      <Select value={testOperator} onValueChange={setTestOperator}>
                        <SelectTrigger id="test-operator">
                          <SelectValue />
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
                      <Label htmlFor="test-value">Valeur seuil</Label>
                      <Input
                        id="test-value"
                        type="number"
                        step="0.1"
                        value={testValue}
                        onChange={(e) => setTestValue(e.target.value)}
                        placeholder="Ex: 7.5"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="test-unit">Unité</Label>
                      <Select value={testUnit} onValueChange={setTestUnit}>
                        <SelectTrigger id="test-unit">
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
                  
                  <div className="space-y-2">
                    <Label>Action à effectuer si condition remplie</Label>
                    <Select value={actionType} onValueChange={setActionType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="create_alert">Créer une alerte</SelectItem>
                        <SelectItem value="schedule_appointment">Planifier un rendez-vous</SelectItem>
                        <SelectItem value="send_notification">Envoyer une notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="action-message">Message d'action</Label>
                    <Textarea
                      id="action-message"
                      value={actionMessage}
                      onChange={(e) => setActionMessage(e.target.value)}
                      placeholder="Ex: Résultat anormal de test pour l'urée, planifier un rendez-vous"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Traitement des résultats</AlertTitle>
              <AlertDescription>
                Les résultats de ce test pourront être utilisés pour déclencher des actions spécifiques en fonction des valeurs observées.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {stepType === WorkflowStepType.TASK && (
          <div className="space-y-2">
            <Label htmlFor="actionType">Type d'action</Label>
            <Select value={actionType} onValueChange={setActionType}>
              <SelectTrigger className="w-full" id="actionType">
                <SelectValue placeholder="Sélectionner l'action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="schedule_appointment">Planifier un rendez-vous</SelectItem>
                <SelectItem value="medical_test">Prescrire un test médical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {actionType === "schedule_appointment" && (
          <div className="pt-2">
            <Label htmlFor="actionReason">Motif du rendez-vous</Label>
            <Input
              id="actionReason"
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="Ex: Suivi contrôle urée"
            />
          </div>
        )}

        {(stepType === WorkflowStepType.ALERT || stepType === WorkflowStepType.REMINDER) && (
          <div className="space-y-2">
            <Label htmlFor="actionMessage">Message</Label>
            <Textarea
              id="actionMessage"
              value={actionMessage}
              onChange={(e) => setActionMessage(e.target.value)}
              placeholder="Ex: Veuillez vérifier les résultats d'analyse du patient"
              rows={2}
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="step-dependency">Dépend d'une étape précédente</Label>
            <Switch
              id="step-dependency"
              checked={hasDependency}
              onCheckedChange={setHasDependency}
            />
          </div>
          
          {hasDependency && (
            <div className="space-y-4 p-4 border rounded-md">
              <div className="space-y-2">
                <Label htmlFor="depends-on-step">Étape précédente (numéro)</Label>
                <Input
                  id="depends-on-step"
                  type="number"
                  min="1"
                  max={stepIndex}
                  value={dependsOnStep}
                  onChange={(e) => setDependsOnStep(parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expected-outcome">Résultat attendu</Label>
                <Select value={expectedOutcome} onValueChange={setExpectedOutcome}>
                  <SelectTrigger id="expected-outcome">
                    <SelectValue placeholder="Résultat déclencheur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Résultat normal</SelectItem>
                    <SelectItem value="abnormal">Résultat anormal</SelectItem>
                    <SelectItem value="alert_triggered">Alerte déclenchée</SelectItem>
                    <SelectItem value="completed">Étape complétée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Condition d'exécution</AlertTitle>
                <AlertDescription>
                  Cette étape ne sera exécutée que si l'étape {dependsOnStep} a le résultat "{expectedOutcome}".
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 py-3 pt-4 bg-white mt-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {initialData?._id ? "Mettre à jour" : "Ajouter l'étape"}
        </Button>
      </div>
    </form>
  );
};

export default WorkflowStepForm;
