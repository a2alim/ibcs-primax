import { environment } from "environments/environment";

// get module list from common service
export const MODULE_LIST = environment.ibcs.authServerBackendEndpoint + 'modules/';
