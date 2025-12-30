import { Process } from "@/types/process";
import { useEffect, useState } from "react";

interface ProcessPrintViewProps {
  processo: Partial<Process>;
}

export function ProcessPrintView({ processo }: ProcessPrintViewProps) {
  const [orgName, setOrgName] = useState("Entidade Responsável");

  useEffect(() => {
    const savedSettings = localStorage.getItem("org-settings");
    if (savedSettings) {
      const { orgName } = JSON.parse(savedSettings);
      if (orgName) setOrgName(orgName);
    }
  }, []);

  if (!processo) return null;

  const formatDate = (date?: string) => {
    if (!date) return "Não definido";
    return date;
  };

  const rgpd = processo.rgpd || {};

  return (
    <div className="hidden print:block print:p-8 bg-white text-black leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">{orgName}</h1>
          <h2 className="text-lg text-slate-700 mt-1">Ficha de Conformidade RGPD</h2>
          <p className="text-xs text-slate-500 mt-1">Registo de Atividade de Tratamento - Subcontratante/Fornecedor</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">{processo.referencia}</div>
          <div className="text-xs text-slate-500">Data de Emissão: {new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {/* Section 1: Identification */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1 text-slate-700">1. Identificação da Entidade</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-xs font-semibold text-slate-500">Fornecedor / Entidade</span>
            <div className="font-medium p-1 border-b border-slate-100">{processo.cliente}</div>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500">NIF</span>
            <div className="font-medium p-1 border-b border-slate-100">{rgpd.nif || "N/A"}</div>
          </div>
          <div className="col-span-2">
            <span className="block text-xs font-semibold text-slate-500">Assunto / Serviço</span>
            <div className="font-medium p-1 border-b border-slate-100">{processo.assunto}</div>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500">Unidade Orgânica</span>
            <div className="font-medium p-1 border-b border-slate-100">{processo.unidadeOrganica || "-"}</div>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500">Responsável Contrato</span>
            <div className="font-medium p-1 border-b border-slate-100">{rgpd.responsavelContrato || "-"}</div>
          </div>
        </div>
      </div>

      {/* Section 2: Contract Data */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1 text-slate-700">2. Dados Contratuais</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
           <div>
            <span className="block text-xs font-semibold text-slate-500">Estado</span>
            <div className="font-medium border rounded px-2 py-1 inline-block mt-1">{processo.estado}</div>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500">Início Contrato</span>
            <div className="font-medium mt-1">{formatDate(rgpd.dataInicioContrato)}</div>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500">Fim Contrato</span>
            <div className="font-medium mt-1">{formatDate(rgpd.dataFimContrato)}</div>
          </div>
        </div>
      </div>

      {/* Section 3: GDPR Analysis */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1 text-slate-700">3. Análise de Risco e Dados</h2>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm mb-4">
           <div className="flex justify-between border-b border-slate-100 py-1">
             <span className="text-slate-600">Acesso a Dados Pessoais?</span>
             <span className="font-bold">{rgpd.temAcessoDados || "N/A"}</span>
           </div>
           <div className="flex justify-between border-b border-slate-100 py-1">
             <span className="text-slate-600">Subcontratação Autorizada?</span>
             <span className="font-bold">{rgpd.subcontratacao || "N/A"}</span>
           </div>
           <div className="flex justify-between border-b border-slate-100 py-1">
             <span className="text-slate-600">Transferência Internacional?</span>
             <span className="font-bold">{rgpd.transferenciaInternacional || "N/A"}</span>
           </div>
            <div className="flex justify-between border-b border-slate-100 py-1 items-center">
             <span className="text-slate-600">Nível de Risco</span>
             <span className={`font-bold px-2 py-0.5 rounded text-xs border ${
                rgpd.nivelRisco === 'Alto' || rgpd.nivelRisco === 'Crítico' 
                ? 'border-red-500 text-red-700' 
                : 'border-slate-200'
             }`}>{rgpd.nivelRisco || "Não Avaliado"}</span>
           </div>
        </div>

        <div className="mb-4">
            <span className="block text-xs font-semibold text-slate-500 mb-1">Tipos de Dados Tratados</span>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded text-sm leading-relaxed">
                {rgpd.tipoDadosPessoais || "Nenhum tipo de dados especificado."}
            </div>
        </div>

        <div>
            <span className="block text-xs font-semibold text-slate-500 mb-1">Finalidade do Tratamento</span>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded text-sm leading-relaxed min-h-[60px]">
                {rgpd.finalidadeTratamento || "Não especificada."}
            </div>
        </div>
      </div>

       {/* Section 4: Security */}
       <div className="mb-8">
        <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1 text-slate-700">4. Medidas de Segurança</h2>
        <div className="text-sm p-3 border border-slate-200 rounded min-h-[40px]">
            {rgpd.medidasSeguranca || "Sem medidas registadas."}
        </div>
      </div>

      {/* Signatures Area */}
      <div className="mt-12 pt-8 border-t-2 border-slate-100">
        <div className="grid grid-cols-2 gap-12">
            <div className="text-center">
                <div className="border-b border-black mb-2 h-8"></div>
                <span className="text-xs font-semibold uppercase">O Responsável pelo Processo</span>
            </div>
            <div className="text-center">
                <div className="border-b border-black mb-2 h-8"></div>
                <span className="text-xs font-semibold uppercase">O Encarregado de Proteção de Dados (DPO)</span>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full text-center text-[10px] text-slate-400 p-4 border-t">
         Processado automaticamente pelo Sistema de Gestão RGPD em {new Date().toLocaleString()}
      </div>
    </div>
  );
}