import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MedicalRecordFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface TestValue {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
}

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({ onSubmit, onCancel }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [type, setType] = useState<string>("blood");
  const [description, setDescription] = useState<string>("");
  const [doctor, setDoctor] = useState<string>("Dr. Richard");
  const [testValues, setTestValues] = useState<TestValue[]>([]);
  const [currentTest, setCurrentTest] = useState<TestValue>({ 
    name: "", 
    value: "", 
    unit: "", 
    referenceRange: "" 
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addTestValue = () => {
    if (!currentTest.name || !currentTest.value) {
      setErrors({ 
        ...errors, 
        testValue: "Le nom et la valeur du test sont requis" 
      });
      return;
    }
    
    setTestValues([...testValues, { ...currentTest }]);
    setCurrentTest({ name: "", value: "", unit: "", referenceRange: "" });
    setErrors({ ...errors, testValue: undefined });
  };

  const removeTestValue = (index: number) => {
    const newValues = [...testValues];
    newValues.splice(index, 1);
    setTestValues(newValues);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    const newErrors: Record<string, string> = {};
    
    if (!description) {
      newErrors.description = "La description est requise";
    }
    
    if (testValues.length === 0) {
      newErrors.tests = "Ajoutez au moins une valeur de test";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Process test values - convert numeric values
    const processedValues = testValues.map(test => ({
      name: test.name,
      value: parseFloat(test.value) || test.value,
      unit: test.unit,
      inRange: true, // This should be determined based on reference range
      referenceRange: test.referenceRange || undefined
    }));
    
    const recordData = {
      type,
      date: date.toISOString(),
      description,
      values: processedValues,
      doctor
    };
    
    onSubmit(recordData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 rounded-md shadow-sm">
      <h3 className="font-medium text-[#021122]">Ajouter des résultats d'analyse</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-[#334349]">Type d'analyse</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type" className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]">
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent className="border-[#91BDC8]">
              <SelectItem value="blood">Analyse sanguine</SelectItem>
              <SelectItem value="urine">Analyse d'urine</SelectItem>
              <SelectItem value="imaging">Imagerie</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date" className="text-[#334349]">Date de l'analyse</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#2980BA]" />
                {format(date, "PPP", { locale: fr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-[#91BDC8]" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                locale={fr}
                className="border-[#91BDC8]"
                classNames={{
                  day_selected: "bg-[#2980BA] text-white hover:bg-[#619DB5]",
                  day_today: "bg-[#ECE7E3] text-[#334349]"
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-[#334349]">
          Description <span className="text-red-500">*</span>
        </Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Bilan sanguin complet, Analyse d'urine..."
          className={`border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5] ${
            errors.description ? "border-red-500" : ""
          }`}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="doctor" className="text-[#334349]">Médecin responsable</Label>
        <Input
          id="doctor"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          placeholder="Nom du médecin"
          className="border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-[#334349]">
            Valeurs mesurées <span className="text-red-500">*</span>
          </Label>
          {errors.tests && (
            <p className="text-xs text-red-500">{errors.tests}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-dashed border-[#91BDC8] rounded-md">
          <div className="space-y-1">
            <Label htmlFor="test-name" className="text-xs text-[#334349]">Nom du test</Label>
            <Input
              id="test-name"
              value={currentTest.name}
              onChange={(e) => setCurrentTest({...currentTest, name: e.target.value})}
              placeholder="Ex: Créatinine"
              className="border-[#91BDC8] text-sm focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="test-value" className="text-xs text-[#334349]">Valeur</Label>
            <Input
              id="test-value"
              value={currentTest.value}
              onChange={(e) => setCurrentTest({...currentTest, value: e.target.value})}
              placeholder="Ex: 1.2"
              className="border-[#91BDC8] text-sm focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="test-unit" className="text-xs text-[#334349]">Unité</Label>
            <Input
              id="test-unit"
              value={currentTest.unit}
              onChange={(e) => setCurrentTest({...currentTest, unit: e.target.value})}
              placeholder="Ex: mg/dL"
              className="border-[#91BDC8] text-sm focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="test-range" className="text-xs text-[#334349]">Intervalle de référence</Label>
              <Input
                id="test-range"
                value={currentTest.referenceRange}
                onChange={(e) => setCurrentTest({...currentTest, referenceRange: e.target.value})}
                placeholder="Ex: 0.8-1.4"
                className="border-[#91BDC8] text-sm focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
              />
            </div>
            <Button 
              type="button" 
              onClick={addTestValue}
              className="mb-0 bg-[#2980BA] hover:bg-[#619DB5] text-white"
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {errors.testValue && (
          <p className="text-xs text-red-500">{errors.testValue}</p>
        )}
        
        {testValues.length > 0 ? (
          <div className="rounded-md shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-[#ECE7E3]/70">
                <TableRow>
                  <TableHead className="text-[#334349]">Nom</TableHead>
                  <TableHead className="text-[#334349]">Valeur</TableHead>
                  <TableHead className="text-[#334349]">Unité</TableHead>
                  <TableHead className="text-[#334349]">Intervalle de référence</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testValues.map((test, index) => (
                  <TableRow key={index} className="hover:bg-[#ECE7E3]/20">
                    <TableCell className="text-[#021122]">{test.name}</TableCell>
                    <TableCell className="text-[#334349]">{test.value}</TableCell>
                    <TableCell className="text-[#334349]">{test.unit}</TableCell>
                    <TableCell className="text-[#334349]">{test.referenceRange || "-"}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeTestValue(index)}
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-3 text-[#619DB5] rounded-md">
            Aucune valeur ajoutée. Ajoutez au moins une valeur de test.
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          className="bg-[#2980BA] hover:bg-[#619DB5] text-white"
        >
          Enregistrer les résultats
        </Button>
      </div>
    </form>
  );
};

export default MedicalRecordForm;
