import { IProcessRepository } from "./IProcessRepository";
import { Process, UnidadeOrganica } from "@/types/process";
import { MOCK_PROCESSES, MOCK_UOS } from "@/data/mock";

const STORAGE_KEY_PROCESSES = "dyad_demo_processes";
const STORAGE_KEY_UOS = "dyad_demo_uos";

export class LocalStorageProcessRepository implements IProcessRepository {
  
  constructor() {
    if (!localStorage.getItem(STORAGE_KEY_PROCESSES)) {
      localStorage.setItem(STORAGE_KEY_PROCESSES, JSON.stringify(MOCK_PROCESSES));
    }
    if (!localStorage.getItem(STORAGE_KEY_UOS)) {
      localStorage.setItem(STORAGE_KEY_UOS, JSON.stringify(MOCK_UOS));
    }
  }

  private getStoredProcesses(): Process[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_PROCESSES) || "[]");
  }

  private saveProcesses(processes: Process[]) {
    localStorage.setItem(STORAGE_KEY_PROCESSES, JSON.stringify(processes));
  }

  private getStoredUOs(): UnidadeOrganica[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_UOS) || "[]");
  }

  async getAllProcesses(): Promise<Process[]> {
    await new Promise(r => setTimeout(r, 400));
    return this.getStoredProcesses();
  }

  async getProcess(id: number): Promise<Process | null> {
    const processes = this.getStoredProcesses();
    return processes.find(p => p.id === id) || null;
  }

  async createProcess(process: Partial<Process>): Promise<Process> {
    await new Promise(r => setTimeout(r, 400));
    const processes = this.getStoredProcesses();
    const uos = this.getStoredUOs();

    let uoName = process.unidadeOrganica;
    if (process.unidadeOrganicaId) {
        const uo = uos.find(u => u.id === process.unidadeOrganicaId);
        if (uo) uoName = uo.sigla; 
    }

    const newProcess: Process = {
      ...process,
      id: Math.max(0, ...processes.map(p => p.id)) + 1,
      unidadeOrganica: uoName, 
      dataEntrada: process.dataEntrada || new Date().toISOString().split('T')[0],
      historico: [{ data: new Date().toISOString().split('T')[0], acao: "Criado (Local)", user: "Demo User" }],
      rgpd: process.rgpd || {}
    } as Process;

    this.saveProcesses([newProcess, ...processes]);
    return newProcess;
  }

  async updateProcess(id: number, process: Partial<Process>): Promise<Process> {
    await new Promise(r => setTimeout(r, 400));
    const processes = this.getStoredProcesses();
    const index = processes.findIndex(p => p.id === id);
    
    if (index === -1) throw new Error("Not found");

    const uos = this.getStoredUOs();
    let uoName = process.unidadeOrganica;
    if (process.unidadeOrganicaId) {
         const uo = uos.find(u => u.id === process.unidadeOrganicaId);
         if (uo) uoName = uo.sigla;
    }

    const updated = { 
        ...processes[index], 
        ...process,
        unidadeOrganica: uoName || processes[index].unidadeOrganica,
        rgpd: { ...processes[index].rgpd, ...process.rgpd }
    };
    
    processes[index] = updated;
    this.saveProcesses(processes);
    return updated;
  }

  async deleteProcess(id: number): Promise<void> {
    await new Promise(r => setTimeout(r, 400));
    const processes = this.getStoredProcesses().filter(p => p.id !== id);
    this.saveProcesses(processes);
  }

  async getUnidadesOrganicas(): Promise<UnidadeOrganica[]> {
    return this.getStoredUOs();
  }
}