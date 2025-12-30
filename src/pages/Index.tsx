import { useState } from "react";
import { toast } from "sonner";
import { Process } from "@/types/process";
import { ProcessStats } from "@/components/dashboard/ProcessStats";
import { ProcessTable } from "@/components/dashboard/ProcessTable";
import { ProcessKanban } from "@/components/dashboard/ProcessKanban";
import { DashboardAlerts } from "@/components/dashboard/DashboardAlerts";
import { DashboardActivity } from "@/components/dashboard/DashboardActivity";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardToolbar } from "@/components/dashboard/DashboardToolbar";
import { useProcessData } from "@/hooks/useProcessData";
import { useProcessFilters } from "@/hooks/useProcessFilters";
import { useProcessImportExport } from "@/hooks/useProcessImportExport";

export default function Index() {
  const { processos, addProcess, updateProcess, deleteProcess, importProcesses } = useProcessData();
  const { 
    termoPesquisa, setTermoPesquisa, 
    filtroRisco, toggleRiskFilter, 
    filtroEstado, toggleStatusFilter,
    clearFilters, processosFiltrados, activeFiltersCount 
  } = useProcessFilters(processos);
  
  const { handleExportCSV, handleFileUpload, triggerFileInput, fileInputRef } = useProcessImportExport(processos, importProcesses);
  
  const [processoAtual, setProcessoAtual] = useState<Partial<Process>>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) {
      const [ano, mes, dia] = dateStr.split("-");
      if (dia && dia.length === 4) return `${ano}/${mes}/${dia}`;
      return `${dia}/${mes}/${ano}`;
    }
    return dateStr;
  };

  const handleSave = () => {
    if (!processoAtual.cliente || !processoAtual.referencia) {
      toast.error("Preenche os campos obrigatórios!");
      return;
    }

    if (processoAtual.id) {
      updateProcess(processoAtual);
    } else {
      addProcess(processoAtual);
    }
    setIsSheetOpen(false);
    setProcessoAtual({});
  };

  const handleEdit = (processo: Process) => {
    setProcessoAtual({ ...processo });
    setIsSheetOpen(true);
  };

  const handleNew = () => {
    setProcessoAtual({}); 
    setIsSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto space-y-8 print:hidden">
        
        <DashboardHeader 
          onExport={handleExportCSV}
          onImportClick={triggerFileInput}
          fileInputRef={fileInputRef}
          onFileUpload={handleFileUpload}
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
          processoAtual={processoAtual}
          setProcessoAtual={setProcessoAtual}
          onSave={handleSave}
          onNew={handleNew}
          formatDate={formatDate}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
                 <ProcessStats processos={processos} />
            </div>
            
            <div className="lg:col-span-1 flex flex-col gap-6">
                 <DashboardAlerts processos={processos} onViewProcess={handleEdit} />
                 
                 <div className="flex-1 min-h-[300px]">
                     <DashboardActivity processos={processos} />
                 </div>
            </div>
        </div>

        <DashboardToolbar 
          termoPesquisa={termoPesquisa}
          setTermoPesquisa={setTermoPesquisa}
          filtroEstado={filtroEstado}
          toggleStatusFilter={toggleStatusFilter}
          filtroRisco={filtroRisco}
          toggleRiskFilter={toggleRiskFilter}
          activeFiltersCount={activeFiltersCount}
          clearFilters={clearFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {viewMode === "list" && (
          <ProcessTable 
            processos={processosFiltrados} 
            onEdit={handleEdit} 
            onDelete={deleteProcess}
          />
        )}

        {viewMode === "board" && (
          <ProcessKanban 
            processos={processosFiltrados} 
            onEdit={handleEdit} 
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
}