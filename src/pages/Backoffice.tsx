import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Save, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { UnidadeOrganica } from "@/types/process";

const DEFAULT_UOS: UnidadeOrganica[] = [
  { id: "1", sigla: "DAF", nome: "Departamento Administrativo e Financeiro" },
  { id: "2", sigla: "DOM", nome: "Departamento de Obras Municipais" },
  { id: "3", sigla: "RH", nome: "Recursos Humanos" },
  { id: "4", sigla: "IT", nome: "Tecnologias de Informação" },
];

export default function Backoffice() {
  const [uos, setUos] = useState<UnidadeOrganica[]>([]);
  const [newSigla, setNewSigla] = useState("");
  const [newNome, setNewNome] = useState("");
  const [orgName, setOrgName] = useState("");
  const [dpoEmail, setDpoEmail] = useState("");

  useEffect(() => {
    // Load UOs
    const savedUos = localStorage.getItem("uos-db");
    if (savedUos) {
      setUos(JSON.parse(savedUos));
    } else {
      setUos(DEFAULT_UOS);
    }

    // Load Settings
    const savedOrg = localStorage.getItem("org-settings");
    if (savedOrg) {
      const settings = JSON.parse(savedOrg);
      setOrgName(settings.orgName || "");
      setDpoEmail(settings.dpoEmail || "");
    }
  }, []);

  const saveUos = (newUos: UnidadeOrganica[]) => {
    setUos(newUos);
    localStorage.setItem("uos-db", JSON.stringify(newUos));
  };

  const handleAddUo = () => {
    if (!newSigla || !newNome) {
      toast.error("Preencha a Sigla e o Nome.");
      return;
    }
    const newUo: UnidadeOrganica = {
      id: Date.now().toString(),
      sigla: newSigla.toUpperCase(),
      nome: newNome
    };
    const updated = [...uos, newUo];
    saveUos(updated);
    setNewSigla("");
    setNewNome("");
    toast.success("Unidade Orgânica adicionada!");
  };

  const handleDeleteUo = (id: string) => {
    const updated = uos.filter(u => u.id !== id);
    saveUos(updated);
    toast.success("Unidade removida.");
  };

  const handleSaveSettings = () => {
    localStorage.setItem("org-settings", JSON.stringify({ orgName, dpoEmail }));
    toast.success("Definições guardadas com sucesso.");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
             <h1 className="text-3xl font-bold text-slate-900">Backoffice</h1>
             <p className="text-slate-500">Configurações globais e gestão de estrutura.</p>
          </div>
        </div>

        <div className="grid gap-8">
            {/* CARD 1: Configurações Gerais */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-slate-500" />
                        Definições da Organização
                    </CardTitle>
                    <CardDescription>Informações usadas nos relatórios e impressões.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nome da Entidade</Label>
                            <Input 
                                value={orgName} 
                                onChange={(e) => setOrgName(e.target.value)} 
                                placeholder="Ex: Câmara Municipal de Exemplo"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email do DPO / Encarregado</Label>
                            <Input 
                                value={dpoEmail} 
                                onChange={(e) => setDpoEmail(e.target.value)} 
                                placeholder="dpo@entidade.pt"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSaveSettings} className="w-full md:w-auto">
                        <Save className="h-4 w-4 mr-2" /> Guardar Definições
                    </Button>
                </CardContent>
            </Card>

            {/* CARD 2: Gestão de Unidades Orgânicas */}
            <Card>
                <CardHeader>
                    <CardTitle>Unidades Orgânicas</CardTitle>
                    <CardDescription>Departamentos ou divisões disponíveis para associação aos processos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-3 items-end bg-slate-50 p-4 rounded-lg border">
                        <div className="space-y-2 w-24">
                            <Label>Sigla</Label>
                            <Input 
                                value={newSigla}
                                onChange={(e) => setNewSigla(e.target.value)}
                                placeholder="RH"
                                maxLength={5}
                            />
                        </div>
                        <div className="space-y-2 flex-1">
                            <Label>Nome do Departamento</Label>
                            <Input 
                                value={newNome}
                                onChange={(e) => setNewNome(e.target.value)}
                                placeholder="Recursos Humanos"
                            />
                        </div>
                        <Button onClick={handleAddUo}>
                            <Plus className="h-4 w-4 mr-2" /> Adicionar
                        </Button>
                    </div>

                    <div className="rounded-md border">
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
                                        <TableCell colSpan={3} className="text-center py-4 text-slate-500">
                                            Nenhuma unidade configurada.
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
                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeleteUo(uo.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
    </div>
  );
}