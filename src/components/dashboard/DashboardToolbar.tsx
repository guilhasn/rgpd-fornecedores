import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, List as ListIcon, LayoutGrid, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardToolbarProps {
  termoPesquisa: string;
  setTermoPesquisa: (t: string) => void;
  filtroEstado: string[];
  toggleStatusFilter: (s: string) => void;
  filtroRisco: string[];
  toggleRiskFilter: (r: string) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
  viewMode: "list" | "board";
  setViewMode: (v: "list" | "board") => void;
}

export function DashboardToolbar({
  termoPesquisa,
  setTermoPesquisa,
  filtroEstado,
  toggleStatusFilter,
  filtroRisco,
  toggleRiskFilter,
  activeFiltersCount,
  clearFilters,
  viewMode,
  setViewMode
}: DashboardToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-slate-200 w-full md:w-auto flex-1 max-w-lg">
        <Search className="h-4 w-4 text-slate-500 ml-2" />
        <Input 
          placeholder="Pesquisar por Fornecedor, NIF, Ref..." 
          className="border-none shadow-none focus-visible:ring-0"
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
        />
        {termoPesquisa && (
          <Button variant="ghost" size="sm" onClick={() => setTermoPesquisa("")} className="h-6 w-6 p-0 hover:bg-transparent">
            <X className="h-4 w-4 text-slate-400" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500 text-xs">
            Limpar Filtros ({activeFiltersCount})
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`border-dashed bg-white ${filtroEstado.length > 0 ? "border-blue-300 bg-blue-50 text-blue-700" : ""}`}>
              <Filter className="mr-2 h-4 w-4" />
              Estado {filtroEstado.length > 0 && `(${filtroEstado.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["Aberto", "Em Curso", "Pendente", "Concluído", "Cancelado"].map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={filtroEstado.includes(status)}
                onCheckedChange={() => toggleStatusFilter(status)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`border-dashed bg-white ${filtroRisco.length > 0 ? "border-orange-300 bg-orange-50 text-orange-700" : ""}`}>
              <Filter className="mr-2 h-4 w-4" />
              Risco {filtroRisco.length > 0 && `(${filtroRisco.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filtrar por Risco</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["Crítico", "Alto", "Médio", "Baixo"].map((risk) => (
              <DropdownMenuCheckboxItem
                key={risk}
                checked={filtroRisco.includes(risk)}
                onCheckedChange={() => toggleRiskFilter(risk)}
              >
                {risk}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}
          >
            <ListIcon className="h-4 w-4 mr-2" /> Lista
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setViewMode("board")}
            className={viewMode === "board" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}
          >
            <LayoutGrid className="h-4 w-4 mr-2" /> Quadro
          </Button>
        </div>
      </div>
    </div>
  );
}