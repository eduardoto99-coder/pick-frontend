import type { LandingDictionary } from "../types";

const es: LandingDictionary = {
  hero: {
    id: "inicio",
    title: "Conecta 1:1 en tu ciudad con personas afines a tus planes",
    description:
      "Pick no es una app de citas. Es una plataforma para activar amistades, hobbies, comunidad y networking por ciudad e interés, con un mensaje inicial listo para WhatsApp.",
    primaryCta: {
      label: "Crear mi perfil gratis",
      href: "/app",
    },
    secondaryCta: {
      label: "Cómo funciona Pick",
      href: "#journey",
    },
    differentiators: [
      "Pocas sugerencias, mejor curadas",
      "Mensaje inicial listo para WhatsApp",
      "Herramientas visibles de seguridad y privacidad",
    ],
    cardTitle: "Así te conecta Pick en minutos",
    cardPoints: [
      "Elige ciudad, interés y tipo de plan: deporte, cultura, idiomas, bienestar, negocios y más.",
      "Pick sugiere una persona compatible y redacta un mensaje inicial claro en tu tono.",
      "Abres WhatsApp, editas si quieres y coordinas el plan.",
    ],
    messagePreviewLabel: "",
    messagePreview:
      "Hola Laura, soy Sam. Vi que a ambos nos interesa la fotografía y estamos en Bogotá. ¿Te animas a una caminata de foto callejera este sábado en la mañana?",
  },
  journey: {
    id: "journey",
    title: "Tres pasos para pasar de idea a plan real",
    description: "",
    steps: [
      {
        title: "1. Define ciudad + interés + objetivo",
        description:
          "Ejemplos: club de lectura, ruta en bici, intercambio de idiomas, turismo local, voluntariado o networking profesional.",
      },
      {
        title: "2. Pick sugiere y redacta el mensaje inicial",
        description:
          "La IA cruza afinidad y contexto para sugerirte una conexión 1:1 y dejar el mensaje listo.",
      },
      {
        title: "3. Coordina por WhatsApp",
        description:
          "Edita, envía y coordina lugar y hora. Tu feedback mejora tus próximas conexiones.",
      },
    ],
  },
  socialProof: {
    id: "social-proof",
    title: "Escenarios que podrías vivir con Pick",
    subtitle: "",
    stories: [
      {
        title: "Llegaste a Bogotá y quieres armar plan cultural",
        description:
          "Si te mudaste por estudio o trabajo, Pick puede conectarte con alguien para visitar museos, ferias o cafés de barrio y empezar a construir red local.",
        context: "Ciudad nueva + cultura + amistad",
      },
      {
        title: "Retomar tu hobby en Cali sin empezar solo",
        description:
          "Puedes encontrar a una persona para salir a trotar, hacer una ruta en bici o practicar baile después del trabajo y volver ese interés parte de tu semana.",
        context: "Bienestar + deporte + rutina",
      },
      {
        title: "Networking más allá de tecnología",
        description:
          "Desde diseño y educación hasta gastronomía o ventas, Pick te ayuda a conectar con perfiles afines en tu ciudad para conversaciones útiles y colaboraciones reales.",
        context: "Carrera profesional + colaboración",
      },
    ],
  },
  trust: {
    id: "seguridad",
    title: "Seguridad y confianza visibles en cada conexión",
    description: "",
    measures: [
      {
        title: "Reportar y bloquear en segundos",
        description:
          "Si algo te incomoda, puedes reportar perfiles y bloquear contactos para cortar interacción de inmediato.",
      },
      {
        title: "Filtros antiabuso en contenido",
        description:
          "Aplicamos filtros para detectar lenguaje ofensivo, spam o comportamientos de riesgo en perfiles y mensajes sugeridos.",
      },
      {
        title: "Recomendaciones de encuentro seguro",
        description:
          "Promovemos encuentros en lugares públicos, confirmar identidad básica y compartir tu plan con alguien de confianza.",
      },
      {
        title: "Manejo responsable de tus datos",
        description:
          "Recopilamos lo mínimo necesario para conectar mejor, con controles de privacidad y procesos para ejercer tus derechos sobre datos.",
      },
    ],
    note: "La confianza no es opcional: es parte central del diseño de Pick.",
  },
  highlights: {
    id: "destacados",
    title: "Para quién es Pick",
    description: "",
    items: [
      {
        title: "Ciudad nueva, círculo nuevo",
        description:
          "Cuando llegas a una ciudad y no conoces a nadie, Pick te conecta con personas que comparten tu plan y disponibilidad.",
      },
      {
        title: "Intereses específicos",
        description:
          "Si quieres activar algo concreto como ajedrez, senderismo, cocina, jazz o running, Pick te ayuda a encontrar esa conexión.",
      },
      {
        title: "Networking con intención",
        description:
          "Conecta por industria, objetivo y ciudad en sectores diversos como salud, educación, comercio, arte o tecnología.",
      },
    ],
    closingCta: {
      label: "Quiero probar Pick",
      href: "/app",
    },
  },
};

export default es;
