export const ACTIVE_TERMS_VERSION = "2026-02-privacy-v3";
export const CONTRACT_LAST_UPDATED = "2026-02-12";
export const CONTRACT_TITLE = "Contrato de servicio y tratamiento de datos";

export const CONTRACT_HIGHLIGHTS = [
  "Usamos tu nombre, correo, ciudades, intereses y foto para sugerir matches y generar el mensaje de introducción por WhatsApp.",
  "Procesamos datos en AWS (Cognito, Lambda, S3), MongoDB Atlas y AWS Bedrock para generación de mensajes; no compartimos tu contacto con patrocinadores sin autorización.",
  "Derechos de habeas data: conocer, actualizar, rectificar o eliminar tus datos y presentar reclamos ante la SIC; contáctanos en privacy@pick.com.",
  "Pick no garantiza la calidad de cada match ni se hace responsable de encuentros fuera de la app; sigue las recomendaciones de seguridad.",
];

export function buildContractUrl(locale = "es"): string {
  return `/${locale}/legal/terminos`;
}

export function buildPrivacyUrl(locale = "es"): string {
  return `/${locale}/legal/privacidad`;
}
