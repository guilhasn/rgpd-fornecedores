import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.processHistory.deleteMany();
  await prisma.processGdpr.deleteMany();
  await prisma.process.deleteMany();
  await prisma.unidadeOrganica.deleteMany();

  // Seed UOs
  await prisma.unidadeOrganica.createMany({
    data: [
      { id: "1", sigla: "DAF", nome: "Departamento Administrativo e Financeiro" },
      { id: "2", sigla: "DOM", nome: "Departamento de Obras Municipais" },
      { id: "3", sigla: "RH", nome: "Recursos Humanos" },
      { id: "4", sigla: "IT", nome: "Tecnologias de Informação" },
    ]
  });

  // Seed Processes
  const p1 = await prisma.process.create({
    data: {
      referencia: "PROC-2024/001",
      cliente: "Limpezas & Brilho Lda",
      assunto: "Serviços de limpeza das instalações municipais",
      unidadeOrganica: "DAF",
      estado: "Em Curso",
      prioridade: "Alta",
      rgpd: {
        create: {
          nif: "501234567",
          dataInicioContrato: "2024-01-01",
          dataFimContrato: "2024-12-31",
          temAcessoDados: "Sim",
          tipoDadosPessoais: "Nomes, Horários dos funcionários",
          nivelRisco: "Baixo",
          medidasSeguranca: "Contrato de confidencialidade assinado"
        }
      },
      historico: {
        create: [
          { data: "2024-01-01", acao: "Processo criado", user: "Admin" },
          { data: "2024-01-15", acao: "Validado pelo DPO", user: "DPO" }
        ]
      }
    }
  });

  console.log({ p1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });