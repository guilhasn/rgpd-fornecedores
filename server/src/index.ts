import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Validation Schemas
const ProcessSchema = z.object({
  referencia: z.string(),
  cliente: z.string(),
  assunto: z.string().optional(),
  unidadeOrganica: z.string(),
  estado: z.string(),
  prioridade: z.string().optional(),
  rgpd: z.object({
    nif: z.string().optional(),
    dataInicioContrato: z.string().optional(),
    dataFimContrato: z.string().optional(),
    temAcessoDados: z.string().optional(),
    tipoDadosPessoais: z.string().optional(),
    finalidadeTratamento: z.string().optional(),
    transferenciaInternacional: z.string().optional(),
    paisTransferencia: z.string().optional(),
    subcontratacao: z.string().optional(),
    nivelRisco: z.string().optional(),
    medidasSeguranca: z.string().optional(),
    responsavelContrato: z.string().optional(),
    emailResponsavel: z.string().optional(),
  }).optional(),
  historico: z.array(z.object({
    data: z.string(),
    acao: z.string(),
    user: z.string().optional()
  })).optional()
});

// --- API ROUTES ---

// 1. GET Processes (List, Filter, Search)
app.get('/api/processes', async (req: Request, res: Response) => {
  try {
    const { q, status, risk, page = '1', limit = '50' } = req.query;
    
    const where: any = {};
    
    // Search filter
    if (q) {
      where.OR = [
        { referencia: { contains: String(q), mode: 'insensitive' } },
        { cliente: { contains: String(q), mode: 'insensitive' } },
        { assunto: { contains: String(q), mode: 'insensitive' } },
      ];
    }

    // Status filter
    if (status && status !== 'Todos') {
      where.estado = String(status);
    }

    // Risk filter (joined table)
    if (risk && risk !== 'Todos') {
      where.rgpd = {
        nivelRisco: String(risk)
      };
    }

    const processes = await prisma.process.findMany({
      where,
      include: {
        rgpd: true,
        historico: {
          orderBy: { createdAt: 'desc' } // or date
        }
      },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      orderBy: { updatedAt: 'desc' }
    });

    const total = await prisma.process.count({ where });

    res.json({
      data: processes,
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch processes' });
  }
});

// 2. GET Single Process
app.get('/api/processes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const process = await prisma.process.findUnique({
      where: { id: Number(id) },
      include: { rgpd: true, historico: true }
    });
    
    if (!process) return res.status(404).json({ error: 'Process not found' });
    res.json(process);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch process' });
  }
});

// 3. POST Create Process
app.post('/api/processes', async (req: Request, res: Response) => {
  try {
    const body = ProcessSchema.parse(req.body);
    
    const newProcess = await prisma.process.create({
      data: {
        referencia: body.referencia,
        cliente: body.cliente,
        assunto: body.assunto,
        unidadeOrganica: body.unidadeOrganica,
        estado: body.estado,
        prioridade: body.prioridade,
        rgpd: {
          create: body.rgpd || {}
        },
        historico: {
          create: body.historico || [{
             data: new Date().toISOString().split('T')[0],
             acao: "Processo criado no sistema",
             user: "Sistema"
          }]
        }
      },
      include: { rgpd: true, historico: true }
    });

    res.status(201).json(newProcess);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create process' });
  }
});

// 4. PUT Update Process
app.put('/api/processes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = ProcessSchema.partial().parse(req.body);
    
    // Check if exists
    const exists = await prisma.process.findUnique({ where: { id: Number(id) }});
    if (!exists) return res.status(404).json({ error: 'Process not found' });

    // Transaction to update relations
    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Update main fields
      const p = await tx.process.update({
        where: { id: Number(id) },
        data: {
          referencia: body.referencia,
          cliente: body.cliente,
          assunto: body.assunto,
          unidadeOrganica: body.unidadeOrganica,
          estado: body.estado,
          prioridade: body.prioridade,
        }
      });

      // 2. Update RGPD (upsert)
      if (body.rgpd) {
        await tx.processGdpr.upsert({
          where: { processId: p.id },
          create: { ...body.rgpd, processId: p.id },
          update: body.rgpd
        });
      }

      // 3. Handle History (Optional: Replace or Add?)
      // Current frontend sends the WHOLE history array. 
      // Strategy: Delete all and recreate is easiest for sync, 
      // but "Add only" is safer.
      // Given the frontend logic "setProcesso({ ...processo, historico: updatedHistory })",
      // it sends the full new state. Let's fully replace for consistency with frontend logic.
      if (body.historico) {
        await tx.processHistory.deleteMany({ where: { processId: p.id } });
        await tx.processHistory.createMany({
          data: body.historico.map(h => ({
            processId: p.id,
            data: h.data,
            acao: h.acao,
            user: h.user
          }))
        });
      }

      return tx.process.findUnique({
        where: { id: p.id },
        include: { rgpd: true, historico: true }
      });
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update process' });
  }
});

// 5. DELETE Process
app.delete('/api/processes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.process.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete process' });
  }
});

// --- UO ROUTES ---

app.get('/api/uos', async (_req: Request, res: Response) => {
  const uos = await prisma.unidadeOrganica.findMany();
  res.json(uos);
});

app.post('/api/uos', async (req: Request, res: Response) => {
  try {
    const { sigla, nome } = req.body;
    if (!sigla || !nome) return res.status(400).send("Missing fields");
    
    const uo = await prisma.unidadeOrganica.create({
      data: { sigla, nome }
    });
    res.json(uo);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create UO' });
  }
});

app.delete('/api/uos/:id', async (req: Request, res: Response) => {
  try {
    await prisma.unidadeOrganica.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) {
    res.status(500).send();
  }
});

// Health check
app.get('/health', (_req: Request, res: Response) => res.send('OK'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});