import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { UnidadeOrganica } from "@/types/process";

const DEFAULT_UOS: UnidadeOrganica[] = [
  { id: "1", sigla: "DAF", nome: "Departamento Administrativo e Financeiro" },
  { id: "2", sigla: "DOM", nome: "Departamento de Obras Municipais" },
  { id: "3", sigla: "RH", nome: "Recursos Humanos" },
  { id: "4", sigla: "IT", nome: "Tecnologias de Informação" },
];

export default function Backoffice() {
  const [uos, setUos] = useState<UnidadeOrganica[]>(() => {
    const saved = localStorage.getItem("uos-db");
    return saved ? JSON.parse(saved) : DEFAULT_UOS;
  });

  const [newSigla, setNewSigla] = useState("");
  const [newNome, setNewNome] = useState("");

  useEffect(() => {
    localStorage.setItem("uos-db", JSON.stringify(uos));
  }, [uos]);

  const handleAdd = () => {
    if (!newSigla || !newNome) {
      toast.error("Preencha a Sigla e o Nome");
      return;
    }

    const newUO: UnidadeOrganica = {
      id: Date.now().toString(),
      sigla: newSigla,
      nome: newNome,
    };

    setUos([...uos, newUO]);
    setNewSigla("");
    setNewNome("");
    toast.success("Unidade Orgânica adicionada!");
  };

  const handleDelete = (id: string) => {
    setUos(uos.filter((u) => u.id !== id));
    toast.success("Unidade Orgânica removida.");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Backoffice</h1>
            <p className="text-slate-500">Gestão de Tabelas Auxiliares</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Unidades Orgânicas</CardTitle>
            <CardDescription>
              Defina as unidades (Departamentos/Divisões) disponíveis para seleção nos processos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Form de Adição */}
            <div className="flex flex-col sm:flex-row gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="space-y-2 flex-1 w-full">
                <label className="text-sm font-medium text-slate-700">Sigla / Abrev.</label>
                <Input 
                  value={newSigla} 
                  onChange={(e) => setNewSigla(e.target.value)} 
                  placeholder="Ex: DAF" 
                />
              </div>
              <div className="space-y-2 flex-[2] w-full">
                <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                <Input 
                  value={newNome} 
                  onChange={(e) => setNewNome(e.target.value)} 
                  placeholder="Ex: Departamento Financeiro" 
                />
              </div>
              <Button onClick={handleAdd} className="bg-slate-900 text-white">
                <Plus className="w-4 h-4 mr-2" /> Adicionar
              </Button>
            </div>

            {/* Tabela de Listagem */}
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Sigla</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="w-[100px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-slate-500 py-8">
                        Nenhuma unidade orgânica definida.
                      </TableCell>
                    </TableRow>
                  ) : (
                    uos.map((uo) => (
                      <TableRow key={uo.id}>
                        <TableCell className="font-medium">{uo.sigla}</TableCell>
                        <TableCell>{uo.nome}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-400 hover:text-red-600"
                            onClick={() => handleDelete(uo.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}