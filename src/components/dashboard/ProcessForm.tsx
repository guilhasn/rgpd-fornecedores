import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer, Save } from "lucide-react";
import { Process, UnidadeOrganica } from "@/types/process";
import { ProcessGdprForm } from "./ProcessGdprForm";
import { ProcessPrintView } from "./ProcessPrintView";
import { ProcessContractTab } from "./ProcessContractTab";
import { ProcessHistoryTab } from "./ProcessHistoryTab";
import { processRepository } from "@/services/processRepository";

interface ProcessFormProps {
  processo: Partial<Process>;
  setProcesso: (processo: Partial<Process>) => void;
  onSave: () => void;
  formatDate: (date: string) => string;
}

export function ProcessForm({ processo, setProcesso, onSave, formatDate }: ProcessFormProps) {
  const [activeTab, setActiveTab] = useState("contrato");
  const [uos, setUos] = useState<UnidadeOrganica[]>([]);

  useEffect(() => {
    // Load UOs using the repository (works for both Local and API)
    processRepository.getUnidadesOrganicas()
      .then(setUos)
      .catch(console.error);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Screen View Container */}
      <div className="flex flex-col h-full print:hidden">
        <div className="flex justify-end mb-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Ficha
            </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-1 flex-none">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contrato">Dados Contrato</TabsTrigger>
              <TabsTrigger value="rgpd">Análise RGPD</TabsTrigger>
              <TabsTrigger value="historico">Histórico & Notas</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 mt-4 overflow-y-auto px-1 min-h-0">
            {/* TAB 1: DADOS GERAIS DO CONTRATO */}
            <TabsContent value="contrato" className="focus-visible:ring-0 mt-0">
              <ProcessContractTab 
                processo={processo} 
                setProcesso={setProcesso} 
                uos={uos} 
              />
            </TabsContent>

            {/* TAB 2: ANÁLISE RGPD */}
            <TabsContent value="rgpd" className="focus-visible:ring-0 mt-0">
               <div className="p-1">
                  <ProcessGdprForm processo={processo} setProcesso={setProcesso} />
               </div>
            </TabsContent>

            {/* TAB 3: HISTÓRICO E NOTAS */}
            <TabsContent value="historico" className="focus-visible:ring-0 h-full mt-0">
              <ProcessHistoryTab 
                processo={processo} 
                setProcesso={setProcesso} 
                formatDate={formatDate} 
              />
            </TabsContent>
          </div>

          <div className="pt-4 mt-auto flex-none border-t border-slate-100 bg-white">
            <Button onClick={onSave} className="w-full bg-slate-900 hover:bg-slate-800">
              <Save className="mr-2 h-4 w-4" /> Guardar Processo
            </Button>
          </div>
        </Tabs>
      </div>

      {/* Print View Container (Only visible when printing) */}
      <ProcessPrintView processo={processo} />
    </>
  );
}