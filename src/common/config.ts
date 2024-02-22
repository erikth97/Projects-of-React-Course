import { Platform } from "react-native";

//const url = 'https://cotizadorcirugiasmuguerza.testing.sisefarpro.com';

// * DEV
// const url = 'https://cotizador-cirugias-muguerza-dev.azurewebsites.net';
// * QA
const url = "https://cotizador-cirugias-muguerza-qa.azurewebsites.net";
// * LOCAL
// const url = 'http://localhost:5000';

export const GEN_URL = (path: string): string => `${url}${path}`;

export const TENANT_CEI_ID: string = "01865ee5-5fc5-4560-a679-4a07187b49c5";
export const CLIENT_CEI_ID: string = "b9e5af11-3458-48b1-8096-64dc2a37e8f5";

export const TENANT_MUGUERZA_ID: string = "d95701c5-77fd-44fb-a92f-f88501887c9a";
export const CLIENT_MUGUERZA_ID: string = "0b9d5f73-9317-40cf-9c4b-8f490aaf4662";

export const CURRENT_QUOTING_VERSION: string = "V1.0";
export const DEFAULT_COSTS_MIN_MARGIN: number = 0.4;
export const DEFAULT_COSTS_SUGGESTED_MARGIN: number = 0.7;
export const DEFAULT_COSTS_ADDITIONAL_MATERIAL_MARGIN: number = 0.1;

export const headers = { "Content-type": "application/json" };
