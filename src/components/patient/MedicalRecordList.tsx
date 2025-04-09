import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search, FileText, BarChart, Microscope, Activity, Filter, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MedicalRecordForm from "./MedicalRecordForm";

interface MedicalRecord {
  id: string;
  type: string;
  date: string;
  description: string;
  values: Array<{
    name: string;
    value: number;
    unit: string;
    inRange: boolean;
    referenceRange?: string;
  }>;
  doctor: string;
}

interface MedicalRecordListProps {
  patientId: string;
  patientName: string;
}

const MedicalRecordList: React.FC<MedicalRecordListProps> = ({ patientId, patientName }) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string | null>(null);
  const [isAddingRecord, setIsAddingRecord] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("list");
  const [detailView, setDetailView] = useState<MedicalRecord | null>(null);
  
  // In a real app, this would fetch from an API
  React.useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockRecords = [
        {
          id: "record1",
          type: "blood",
          date: new Date().toISOString(),
          description: "Bilan sanguin complet",
          values: [
            { name: "Créatinine", value: 1.2, unit: "mg/dL", inRange: true, referenceRange: "0.8-1.4" },
            { name: "eGFR", value: 75, unit: "mL/min/1.73m²", inRange: true, referenceRange: ">60" },
            { name: "Urée", value: 8.2, unit: "mmol/L", inRange: true, referenceRange: "2.5-8.3" },
            { name: "Potassium", value: 4.5, unit: "mmol/L", inRange: true, referenceRange: "3.5-5.0" },
          ],
          doctor: "Dr. Richard"
        }
      ];
      setRecords(mockRecords);
      setLoading(false);
    }, 1000);
  }, [patientId]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleAddRecord = (recordData: any) => {
    const newRecord = {
      ...recordData,
      id: `record-${Date.now()}`,
      date: new Date().toISOString()
    };
    
    setRecords([newRecord, ...records]);
    setIsAddingRecord(false);
  };
  
  const filteredRecords = records.filter(record => {
    let matchesSearch = true;
    let matchesType = true;
    let matchesTimeRange = true;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      matchesSearch = record.description.toLowerCase().includes(term) ||
        record.type.toLowerCase().includes(term);
    }
    
    if (selectedType) {
      matchesType = record.type === selectedType;
    }
    
    // Time range filtering would be implemented here
    
    return matchesSearch && matchesType && matchesTimeRange;
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch (e) {
      return dateString;
    }
  };
  
  // Get color for test results based on inRange
  const getResultColor = (inRange: boolean) => {
    return inRange 
      ? "text-green-600" 
      : "text-red-600";
  };

  // Get icon for record type
  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case "blood":
        return <Activity className="h-4 w-4 text-red-500" />;
      case "urine":
        return <Microscope className="h-4 w-4 text-yellow-500" />;
      case "imaging":
        return <BarChart className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-[#2980BA]">Résultats d'analyses</CardTitle>
          {!isAddingRecord && (
            <Button 
              size="sm" 
              onClick={() => setIsAddingRecord(true)}
              className="bg-[#2980BA] hover:bg-[#619DB5] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter des résultats
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {isAddingRecord ? (
          <MedicalRecordForm 
            onSubmit={handleAddRecord}
            onCancel={() => setIsAddingRecord(false)}
          />
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#619DB5]" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-8 border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]"
                />
              </div>
              <Select value={selectedType || ""} onValueChange={(value) => setSelectedType(value || null)}>
                <SelectTrigger className="w-[180px] border-[#91BDC8] focus:border-[#2980BA] focus-visible:ring-[#619DB5]">
                  <SelectValue placeholder="Type d'analyse" />
                </SelectTrigger>
                <SelectContent className="border-[#91BDC8]">
                  <SelectItem value="">Tous les types</SelectItem>
                  <SelectItem value="blood">Analyses sanguines</SelectItem>
                  <SelectItem value="urine">Analyses d'urine</SelectItem>
                  <SelectItem value="imaging">Imagerie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 border-[#91BDC8] bg-[#ECE7E3]/50">
                <TabsTrigger 
                  value="list"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#2980BA]"
                >
                  Liste
                </TabsTrigger>
                <TabsTrigger 
                  value="chart"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#2980BA]"
                  disabled={records.length === 0}
                >
                  Graphiques
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#2980BA]" />
                  </div>
                ) : records.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto opacity-20 mb-2" />
                    <h3 className="font-medium text-lg text-[#334349]">Aucune analyse disponible</h3>
                    <p className="text-[#619DB5]">Ajoutez des résultats d'analyse pour ce patient</p>
                    <Button 
                      className="mt-4 bg-[#2980BA] hover:bg-[#619DB5] text-white" 
                      onClick={() => setIsAddingRecord(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter des résultats
                    </Button>
                  </div>
                ) : detailView ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-lg text-[#021122]">{detailView.description}</h3>
                        <p className="text-sm text-[#619DB5]">
                          {formatDate(detailView.date)} - {detailView.doctor}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setDetailView(null)}
                        className="border-[#91BDC8] text-[#334349] hover:bg-[#ECE7E3]/20"
                      >
                        Retour à la liste
                      </Button>
                    </div>
                    
                    <Table className="border-[#91BDC8]">
                      <TableHeader className="bg-[#ECE7E3]/70">
                        <TableRow>
                          <TableHead className="text-[#334349]">Paramètre</TableHead>
                          <TableHead className="text-[#334349]">Valeur</TableHead>
                          <TableHead className="text-[#334349]">Unité</TableHead>
                          <TableHead className="text-[#334349]">Valeurs de référence</TableHead>
                          <TableHead className="text-[#334349]">Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detailView.values.map((value, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium text-[#021122]">{value.name}</TableCell>
                            <TableCell className={getResultColor(value.inRange)}>{value.value}</TableCell>
                            <TableCell>{value.unit}</TableCell>
                            <TableCell>{value.referenceRange || "N/A"}</TableCell>
                            <TableCell>
                              <Badge variant={value.inRange ? "outline" : "destructive"} className={value.inRange ? "border-green-500 text-green-700" : ""}>
                                {value.inRange ? "Normal" : "Anormal"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : filteredRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#619DB5]">Aucun résultat ne correspond à votre recherche.</p>
                  </div>
                ) : (
                  <div className="rounded-md shadow-sm overflow-hidden">
                    <Table>
                      <TableHeader className="bg-[#ECE7E3]/70">
                        <TableRow>
                          <TableHead className="text-[#334349]">Date</TableHead>
                          <TableHead className="text-[#334349]">Type</TableHead>
                          <TableHead className="text-[#334349]">Description</TableHead>
                          <TableHead className="text-[#334349]">Docteur</TableHead>
                          <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map((record) => (
                          <TableRow 
                            key={record.id}
                            className="hover:bg-[#ECE7E3]/20"
                          >
                            <TableCell className="font-medium text-[#021122]">
                              {formatDate(record.date)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getRecordTypeIcon(record.type)}
                                <span className="ml-2 text-[#334349]">
                                  {record.type === "blood" ? "Sanguin" : 
                                   record.type === "urine" ? "Urine" : 
                                   record.type === "imaging" ? "Imagerie" : "Autre"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-[#334349]">{record.description}</TableCell>
                            <TableCell className="text-[#334349]">{record.doctor}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDetailView(record)}
                                className="text-[#2980BA] hover:bg-[#ECE7E3]/20"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="chart">
                <div className="text-center py-12">
                  <BarChart className="h-12 w-12 mx-auto opacity-20 mb-2" />
                  <h3 className="font-medium text-lg text-[#334349]">Visualisation des résultats</h3>
                  <p className="text-[#619DB5]">
                    Les graphiques seront disponibles après plusieurs analyses
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalRecordList;
