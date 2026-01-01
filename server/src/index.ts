import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Validation schemas
const ProcessSchema = z.object({
  referencia: z.string(),
  cliente: z.string(),
  assunto: z.string(),
  estado: z.string(),
  prioridade: z.string(),
  dataEntrada: z.string().transform((str) => new Date(str)),
  unidadeOrganicaId: z.string(),
  user: z.string().optional().default('Sistema'),
});

const GdprSchema = z.object({
  nif: z.string().optional(),
  dataInicioContrato: z.string().optional().transform((str) => str ? new Date(str) : null),
  dataFimContrato: z.string().optional().transform((str) => str ? new Date(str) : null),
  temAcessoDados: z.string().optional(),
  tipoDadosPessoais: z.string().optional(),
  nivelRisco: z.string().optional(),
  medidasSeguranca: z.string().optional(),
  finalidadeTratamento: z.string().optional(),
  subcontratacao: z.string().optional(),
  transferenciaInternacional: z.string().optional(),
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Unidades Organicas
app.get('/api/unidades-organicas', async (req, res) => {
  try {
    const unidades = await prisma.unidadeOrganica.findMany({
      orderBy: { nome: 'asc' }
    });
    res.json(unidades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organic units' });
  }
});

// Processes
app.get('/api/processes', async (req, res) => {
  try {
    const processes = await prisma.process.findMany({
      include: {
        unidadeOrganica: true,
        rgpd: true,
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(processes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch processes' });
  }
});

app.get('/api/processes/:id', async (req, res) => {
  try {
    const process = await prisma.process.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        unidadeOrganica: true,
        rgpd: true,
        historico: {
          orderBy: { data: 'desc' } // Fixed: Changed from createdAt to data
        }
      }
    });
    if (!process) return res.status(404).json({ error: 'Process not found' });
    res.json(process);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch process' });
  }
});

app.post('/api/processes', async (req, res) => {
  try {
    const data = ProcessSchema.parse(req.body);
    
    const newProcess = await prisma.process.create({
      data: {
        referencia: data.referencia,
        cliente: data.cliente,
        assunto: data.assunto,
        estado: data.estado,
        prioridade: data.prioridade,
        dataEntrada: data.dataEntrada,
        // Fixed: Use connect syntax instead of direct assignment
        unidadeOrganica: {
            connect: { id: data.unidadeOrganicaId }
        },
        historico: {
          create: {
            acao: 'Processo criado',
            user: data.user || 'Sistema', // Ensure string
            data: new Date()
          }
        }
      },
      include: {
        unidadeOrganica: true
      }
    });
    
    res.json(newProcess);
  } catch (error) {
    console.error('Create error:', error);
    res.status(400).json({ error: 'Failed to create process' });
  }
});

app.put('/api/processes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = ProcessSchema.partial().parse(req.body);
    const userStr = req.body.user || 'Sistema';

    // Use any to construct the update object dynamically
    const updateData: any = { ...data };
    
    // Fixed: Handle relation update correctly
    if (data.unidadeOrganicaId) {
        updateData.unidadeOrganica = {
            connect: { id: data.unidadeOrganicaId }
        };
        // Remove the raw ID field to avoid Prisma errors
        delete updateData.unidadeOrganicaId;
    }
    
    // Remove user field as it belongs to history, not process
    delete updateData.user;

    const updatedProcess = await prisma.process.update({
      where: { id },
      data: updateData,
      include: { unidadeOrganica: true }
    });

    // Add history entry
    await prisma.processHistory.create({
      data: {
        processId: id,
        acao: 'Processo atualizado',
        user: String(userStr),
        data: new Date()
      }
    });

    res.json(updatedProcess);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ error: 'Failed to update process' });
  }
});

// GDPR Info
app.put('/api/processes/:id/gdpr', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = GdprSchema.parse(req.body);
    const userStr = req.body.user || 'Sistema';

    const updatedGdpr = await prisma.processGdpr.upsert({
      where: { processId: id },
      create: {
        processId: id,
        ...data
      },
      update: data
    });

    await prisma.processHistory.create({
      data: {
        processId: id,
        acao: 'Informação RGPD atualizada',
        user: String(userStr),
        data: new Date()
      }
    });

    res.json(updatedGdpr);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update GDPR info' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});