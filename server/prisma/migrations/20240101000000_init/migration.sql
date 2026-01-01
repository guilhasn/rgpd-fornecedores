-- CreateTable
CREATE TABLE "unidades_organicas" (
    "id" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidades_organicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processes" (
    "id" SERIAL NOT NULL,
    "referencia" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL,
    "dataEntrada" TIMESTAMP(3) NOT NULL,
    "unidadeOrganicaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_gdpr" (
    "id" SERIAL NOT NULL,
    "processId" INTEGER NOT NULL,
    "nif" TEXT,
    "dataInicioContrato" TIMESTAMP(3),
    "dataFimContrato" TIMESTAMP(3),
    "temAcessoDados" TEXT,
    "tipoDadosPessoais" TEXT,
    "nivelRisco" TEXT,
    "medidasSeguranca" TEXT,
    "finalidadeTratamento" TEXT,
    "subcontratacao" TEXT,
    "transferenciaInternacional" TEXT,

    CONSTRAINT "process_gdpr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_history" (
    "id" SERIAL NOT NULL,
    "processId" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acao" TEXT NOT NULL,
    "user" TEXT NOT NULL,

    CONSTRAINT "process_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unidades_organicas_sigla_key" ON "unidades_organicas"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "processes_referencia_key" ON "processes"("referencia");

-- CreateIndex
CREATE UNIQUE INDEX "process_gdpr_processId_key" ON "process_gdpr"("processId");

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_unidadeOrganicaId_fkey" FOREIGN KEY ("unidadeOrganicaId") REFERENCES "unidades_organicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_gdpr" ADD CONSTRAINT "process_gdpr_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_history" ADD CONSTRAINT "process_history_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;