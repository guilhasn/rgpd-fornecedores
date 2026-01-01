import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const unidades = [
    { sigla: 'IT', nome: 'Tecnologias de Informação' },
    { sigla: 'RH', nome: 'Recursos Humanos' },
    { sigla: 'FIN', nome: 'Departamento Financeiro' },
    { sigla: 'JUR', nome: 'Gabinete Jurídico' },
    { sigla: 'COM', nome: 'Comercial e Marketing' },
    { sigla: 'LOG', nome: 'Logística e Armazém' },
    { sigla: 'ADM', nome: 'Administração' }
  ];

  for (const uo of unidades) {
    const exists = await prisma.unidadeOrganica.findFirst({
      where: { sigla: uo.sigla }
    });

    if (!exists) {
      await prisma.unidadeOrganica.create({
        data: uo
      });
      console.log(`✅ Created UO: ${uo.sigla}`);
    } else {
      console.log(`ℹ️  UO already exists: ${uo.sigla}`);
    }
  }

  console.log('🏁 Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });