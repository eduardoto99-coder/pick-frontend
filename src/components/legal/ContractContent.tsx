import { Chip, Divider, List, ListItem, Stack, Typography } from "@mui/material";

import {
  ACTIVE_TERMS_VERSION,
  CONTRACT_HIGHLIGHTS,
  CONTRACT_LAST_UPDATED,
  CONTRACT_TITLE,
} from "@/constants/consent";

type ContractContentProps = {
  compact?: boolean;
};

const sections = [
  {
    title: "Responsable y alcance",
    items: [
      "Pick SAS, con domicilio en Colombia (Bogotá D.C.), es responsable del tratamiento. Contacto: privacy@pick.com.",
      "Servicio dirigido a mayores de 18 años. Cubre la app web, las APIs y comunicaciones por WhatsApp/correo.",
    ],
  },
  {
    title: "Datos que recolectamos",
    items: [
      "Datos obligatorios: correo, contraseña (gestionados por Cognito) y nombre visible para tu cuenta.",
      "Datos opcionales: número de teléfono/WhatsApp, ciudades, intereses, bio, foto de perfil (S3) y enlaces a LinkedIn/Instagram.",
      "Información de matches: combinaciones de intereses/ciudades, códigos de match, mensaje introductorio generado por inteligencia artificial y presencia de patrocinador.",
      "Métricas de uso y seguridad: IP, dispositivo/user-agent, eventos de producto, logs y reportes de abuso.",
      "Comentarios que envíes a soporte o formularios de feedback. No solicitamos datos sensibles; no los incluyas en textos libres.",
    ],
  },
  {
    title: "Finalidades y bases legales",
    items: [
      "Prestar el servicio: crear tu cuenta, sugerir matches, generar y mostrar el mensaje de introducción por WhatsApp y gestionar patrocinadores relevantes.",
      "Seguridad y prevención de fraude/abuso, incluidas listas de bloqueo, moderación de contenido y límites de uso.",
      "Analítica de producto y calidad para mejorar la experiencia (optimizaciones, experimentos controlados).",
      "Comunicaciones operativas (confirmaciones, alertas de seguridad); marketing opcional y revocable.",
      "Bases legales: ejecución del contrato, consentimiento expreso para tratamiento y transferencias internacionales, interés legítimo en seguridad/mejora y cumplimiento de obligaciones legales.",
    ],
  },
  {
    title: "Derechos Habeas Data y canales",
    items: [
      "Conocer, actualizar, rectificar, suprimir datos; solicitar prueba de autorización; ser informado sobre uso; presentar reclamos; revocar consentimiento cuando aplique.",
      "Canal: privacy@pick.com. Consultas se responden en máximo 10 días hábiles; reclamos en máximo 15 días hábiles conforme Decreto 1377 de 2013.",
      "Recurso ante la Superintendencia de Industria y Comercio (www.sic.gov.co) si no estás conforme con la respuesta.",
    ],
  },
  {
    title: "Encargados y terceros",
    items: [
      "AWS (Cognito, API Gateway, Lambda, S3/CloudFront) para autenticación, ejecución y medios; MongoDB Atlas para datos operativos.",
      "Proveedor de inteligencia artificial (OpenAI GPT-4o-mini o AWS Bedrock Claude) solo recibe nombres, intereses, ciudad y código de match; no enviamos tu teléfono y los prompts no se usan para entrenar modelos según la política actual del proveedor.",
      "Herramientas de analítica (Amplitude/PostHog) cuando se activen, bajo acuerdos de encargo de tratamiento.",
      "Patrocinadores solo reciben métricas agregadas; no compartimos tu contacto sin autorización explícita.",
      "WhatsApp recibe el texto del mensaje y metadatos cuando abres el deeplink para conversar.",
    ],
  },
  {
    title: "Transferencias internacionales",
    items: [
      "Los datos pueden almacenarse o procesarse en EE. UU. u otras jurisdicciones con medidas contractuales y técnicas (cifrado, controles de acceso).",
      "Al aceptar, autorizas estas transferencias conforme a la Ley 1581 de 2012 y normas aplicables.",
    ],
  },
  {
    title: "Conservación",
    items: [
      "Mantenemos datos de cuenta y perfil mientras uses el servicio.",
      "Logs operativos y de seguridad hasta 12 meses; copias de respaldo hasta 90 días.",
      "Tras una solicitud de eliminación borramos los datos salvo lo necesario para obligaciones legales o resolución de disputas.",
    ],
  },
  {
    title: "Seguridad y notificación",
    items: [
      "Ciframos datos en tránsito, restringimos accesos y auditamos usos internos. Notificaremos incidentes según la ley aplicable.",
      "Deber del usuario: mantener credenciales seguras y reportar accesos o contenido sospechoso.",
    ],
  },
  {
    title: "Comunicaciones y marketing",
    items: [
      "Al crear la cuenta autorizas mensajes operativos por WhatsApp/correo vinculados a tus matches y seguridad.",
      "Marketing y novedades son opcionales; puedes solicitar la baja en cualquier momento.",
    ],
  },
  {
    title: "Conducta, seguridad y patrocinadores",
    items: [
      "No uses Pick para acosar, discriminar, enviar spam, actividades ilegales o suplantación. Podemos suspender cuentas que incumplan.",
      "Eres responsable de tu seguridad en encuentros; verifica identidades y reúne en lugares seguros. Pick no controla interacciones fuera de la app ni garantiza afinidad de cada match.",
      "Los mensajes con patrocinio se etiquetan; no aceptes beneficios de terceros que contradigan tu ley local o nuestras reglas.",
    ],
  },
  {
    title: "Limitación de responsabilidad",
    items: [
      "Pick se ofrece “tal cual”; no garantizamos disponibilidad continua ni que cada match genere un resultado específico.",
      "No somos responsables por daños derivados de interacciones entre usuarios o por el uso de información generada por inteligencia artificial, salvo dolo o culpa grave según la ley colombiana.",
    ],
  },
  {
    title: "Menores, suspensión y terminación",
    items: [
      "El servicio no está dirigido a menores de 18 años; eliminaremos datos de menores si tenemos conocimiento.",
      "Podemos suspender o cerrar cuentas por incumplimientos de este contrato o riesgos de seguridad.",
    ],
  },
  {
    title: "Ley y jurisdicción",
    items: [
      "Este contrato se rige por las leyes de Colombia. Cualquier controversia se resolverá ante los jueces de Bogotá D.C., salvo que pactemos un mecanismo alternativo de solución de conflictos.",
    ],
  },
  {
    title: "Actualizaciones",
    items: [
      "Publicaremos cambios relevantes y pediremos nueva aceptación cuando se requiera.",
      `La versión vigente es ${ACTIVE_TERMS_VERSION} (última actualización ${CONTRACT_LAST_UPDATED}).`,
    ],
  },
];

export default function ContractContent({ compact = false }: ContractContentProps) {
  return (
    <Stack spacing={compact ? 2 : 3} divider={<Divider flexItem />}>
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant={compact ? "h6" : "h5"} fontWeight={600}>
            {CONTRACT_TITLE}
          </Typography>
          <Chip label={`Versión ${ACTIVE_TERMS_VERSION}`} size="small" color="primary" />
          <Chip
            label={`Actualizado ${CONTRACT_LAST_UPDATED}`}
            size="small"
            variant="outlined"
            color="default"
          />
        </Stack>
        <Typography variant="body1">
          Este contrato explica cómo Pick trata tus datos cuando creas una cuenta y usas las
          introducciones por WhatsApp. Debes aceptarlo para continuar.
        </Typography>
        {compact ? (
          <List dense sx={{ listStyleType: "disc", pl: 3 }}>
            {CONTRACT_HIGHLIGHTS.map((item) => (
              <ListItem key={item} sx={{ display: "list-item", py: 0, pl: 0 }}>
                <Typography variant="body2">{item}</Typography>
              </ListItem>
            ))}
          </List>
        ) : null}
      </Stack>

      {sections.map((section) => (
        <Stack key={section.title} spacing={1.5}>
          <Typography variant={compact ? "subtitle1" : "h6"} fontWeight={600}>
            {section.title}
          </Typography>
          <List dense={compact} sx={{ listStyleType: "disc", pl: 3 }}>
            {section.items.map((item) => (
              <ListItem key={item} sx={{ display: "list-item", pl: 0 }}>
                <Typography variant="body2">{item}</Typography>
              </ListItem>
            ))}
          </List>
        </Stack>
      ))}
    </Stack>
  );
}
