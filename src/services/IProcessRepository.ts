import { Process, UnidadeOrganica } from "@/types/process";

export interface IProcessRepository {
  // Processes
  getAllProcesses(): Promise<Process[]>;
  getProcess(id: number): Promise<Process | null>;
  createProcess(process: Partial<Process>): Promise<Process>;
  updateProcess(id: number, process: Partial<Process>): Promise<Process>;
  deleteProcess(id: number): Promise<void>;
  
  // Auxiliary Data
  getUnidadesOrganicas(): Promise<UnidadeOrganica[]>;
}