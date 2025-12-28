import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database, Server, Container, Terminal, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Dados simulados para visualização
const MOCK_DATA = [
  { id: 1, name: "Ana Silva", email: "ana@exemplo.com", role: "Admin", status: "Active" },
  { id: 2, name: "João Santos", email: "joao@exemplo.com", role: "User", status: "Active" },
  { id: 3, name: "Maria Costa", email: "maria@exemplo.com", role: "Editor", status: "Offline" },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulateConnection = () => {
    setIsLoading(true);
    toast.info("A tentar conectar ao contentor da BD...");
    
    // Simulação de delay de rede
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Conectado com sucesso à base de dados PostgreSQL!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Container className="w-10 h-10 text-blue-600" />
            Docker Ready App
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Esta aplicação está configurada para ser contentorizada. Abaixo podes ver o estado simulado do sistema e instruções de deploy.
          </p>
        </div>

        {/* Dashboard Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frontend Container</CardTitle>
              <Server className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Running</div>
              <p className="text-xs text-muted-foreground">Porta 3000 (Mapeada para 80)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Service</CardTitle>
              <Database className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">PostgreSQL 15</div>
              <p className="text-xs text-muted-foreground">Volume persistente configurado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado da Rede</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Bridge</div>
              <p className="text-xs text-muted-foreground">app-network ativa</p>
            </CardContent>
          </Card>
        </div>

        {/* Área Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tabela de Dados (Simulação) */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Dados do Utilizador</CardTitle>
                  <CardDescription>
                    Estes dados viriam da tua base de dados PostgreSQL.
                  </CardDescription>
                </div>
                <Button onClick={handleSimulateConnection} disabled={isLoading}>
                  {isLoading ? "A conectar..." : "Testar Conexão BD"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_DATA.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Instruções */}
          <Card className="bg-slate-900 text-slate-50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Como rodar localmente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-400">1. Certifica-te que tens o Docker Desktop instalado.</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-400">2. Na raiz do projeto, executa:</p>
                <code className="block bg-black p-3 rounded text-sm font-mono text-green-400">
                  docker-compose up -d
                </code>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-400">3. Acede à aplicação em:</p>
                <code className="block bg-black p-3 rounded text-sm font-mono text-blue-400">
                  http://localhost:3000
                </code>
              </div>
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-900 rounded text-xs text-blue-200">
                Nota: Esta aplicação é Frontend-only. Para persistir dados reais no Postgres, precisarias de uma API (Node.js/Go/Python) a correr entre o React e o Postgres.
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Index;