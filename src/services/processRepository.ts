import { ApiProcessRepository } from "./ApiProcessRepository";
import { LocalStorageProcessRepository } from "./LocalStorageProcessRepository";
import { IProcessRepository } from "./IProcessRepository";

const mode = import.meta.env.VITE_STORAGE_MODE;

console.log(`[App] Initializing Storage Mode: ${mode || 'local (default)'}`);

export const processRepository: IProcessRepository = 
  mode === 'api' 
    ? new ApiProcessRepository() 
    : new LocalStorageProcessRepository();