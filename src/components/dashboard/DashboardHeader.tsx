import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProcessForm } from "./ProcessForm";
import { Process } from "@/types/process";

interface DashboardHeaderProps {
  onExport: () => void;
  onImportClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
  processoAtual: Partial<Process>;
  setProcessoAtual: (p: Partial<Process>) => void;
  onSave: () => void;
  onNew: () => void;
  formatDate: (d: string) => string;
}

export function DashboardHeader({
  onExport,
  onImportClick,
  fileInputRef,
  onFileUpload,
  isSheetOpen,
  setIsSheetOpen,
  processoAtual,
  setProcessoAtual,
  onSave,
  onNew,
  formatDate
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestão de Fornecedores & RGPD</h1>
        <p className="text-slate-500 mt-1">Dashboard de Conformidade e Avaliação de Risco</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link to="/backoffice">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Backoffice
          </Button>
        </Link>
      
        <input 
          type="file" 
          accept=".csv" 
          ref={fileInputRef}
          className="hidden"
          onChange={onFileUpload}
        />
        <Button variant="outline" onClick={onImportClick}>
          <Upload className="mr-2 h-4 w-4" /> Importar CSV
        </Button>
        
        <Button variant="outline" className="hidden md:flex" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" /> Exportar Relatório
        </Button>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={onNew} className="bg-slate-900 hover:bg-slate-800">
              <Plus className="mr-2 h-4 w-4" /> Novo Processo
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-2xl w-full print:border-none print:shadow-none print:max-w-none print:w-full print:h-full print:p-0 flex flex-col">
            <SheetHeader className="mb-6 print:hidden flex-none">
              <SheetTitle>{processoAtual.id ? `Editar ${processoAtual.referencia}` : "Novo Processo"}</SheetTitle>
              <SheetDescription>
                Gere os detalhes contratuais e a avaliação de impacto RGPD.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <ProcessForm 
                processo={processoAtual} 
                setProcesso={setProcessoAtual} 
                onSave={onSave}
                formatDate={formatDate}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}