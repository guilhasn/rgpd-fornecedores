import { IProcessRepository } from "./IProcessRepository";
import { Process, UnidadeOrganica } from "@/types/process";

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export class ApiProcessRepository implements IProcessRepository {
  
  async getAllProcesses(): Promise<Process[]> {
    const res = await fetch(`${API_BASE}/processes`);
    if (!res.ok) throw new Error("Failed to fetch processes");
    return res.json();
  }

  async getProcess(id: number): Promise<Process | null> {
    const res = await fetch(`${API_BASE}/processes/${id}`);
    if (!res.ok) return null;
    return res.json();
  }

  async createProcess(process: Partial<Process>): Promise<Process> {
    const payload = {
      ...process,
      unidadeOrganicaId: process.unidadeOrganicaId || 
        (process.unidadeOrganica as any)?.id 
    };

    const res = await fetch(`${API_BASE}/processes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create");
    }
    return res.json();
  }

  async updateProcess(id: number, process: Partial<Process>): Promise<Process> {
     const payload: any = { ...process };
     
     if (process.unidadeOrganicaId) {
         payload.unidadeOrganicaId = process.unidadeOrganicaId;
     }
     
     delete payload.unidadeOrganica; 
     delete payload.rgpd?.processId;
     delete payload.rgpd?.id;

    const res = await fetch(`${API_BASE}/processes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (process.rgpd) {
       await fetch(`${API_BASE}/processes/${id}/gdpr`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(process.rgpd),
       });
    }

    if (!res.ok) throw new Error("Failed to update");
    
    return this.getProcess(id) as Promise<Process>;
  }

  async deleteProcess(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/processes/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete");
  }

  async getUnidadesOrganicas(): Promise<UnidadeOrganica[]> {
    const res = await fetch(`${API_BASE}/unidades-organicas`);
    if (!res.ok) throw new Error("Failed to fetch UOs");
    return res.json();
  }
}