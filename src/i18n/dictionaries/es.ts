import type { LandingDictionary } from "../types";

const es: LandingDictionary = {
  hero: {
    id: "inicio",
    title: "Conecta 1:1 en tu ciudad con personas que comparten tus intereses",
    description:
      "Pick no es una app de citas. Es una plataforma para amigos, planes, hobbies, colaboraciones y networking: te conecta por ciudad + interés y te deja el primer mensaje listo para WhatsApp.",
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
      "Privacidad, seguridad y patrocinio etiquetado",
    ],
    cardTitle: "Así te conecta Pick en minutos",
    cardPoints: [
      "Elige ciudad, interés y tipo de plan que quieres activar.",
      "Pick encuentra una persona compatible y redacta un mensaje inicial claro, en tu tono.",
      "Abres WhatsApp, editas si quieres y coordinas el plan.",
    ],
    messagePreviewLabel: "Ejemplo de mensaje automático:",
    messagePreview:
      "Hola Juan, soy Diego. Vi que a ambos nos gusta el fútbol y estamos en Medellín. ¿Te animas a jugar un 5v5 esta semana en una cancha pública?",
  },
  journey: {
    id: "journey",
    title: "Tres pasos para pasar de idea a plan real",
    description: "Diseñado para reducir fricción y conectar con intención",
    steps: [
      {
        title: "1. Define ciudad + interés + objetivo",
        description:
          "Ejemplos: jugar fútbol, plan de jazz, networking en software, turismo local, fiesta o bienestar.",
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
        title: "Tu amigo local para descubrir Medellín",
        description:
          "En Pick puedes conocer a tu amigo local en Medellín para ir de fiesta por la Comuna 13, conocer lugares auténticos y recorrer la ciudad con alguien que ya la vive.",
        context: "Ciudad nueva + turismo + fiesta",
      },
      {
        title: "Compañía para activar tu hobby",
        description:
          "En Pick puedes encontrar a alguien con quien jugar fútbol después del trabajo, coordinar una cancha pública y sumar un nuevo plan semanal en tu ciudad.",
        context: "Interés puntual + plan recurrente",
      },
      {
        title: "Networking que sí aterriza",
        description:
          "En Pick puedes conectar con perfiles de software para tomarte un café, compartir ideas y abrir colaboraciones reales si están en la misma ciudad.",
        context: "Networking + colaboración",
      },
    ],
  },
  highlights: {
    id: "destacados",
    title: "Para quién es Pick",
    description:
      "Si buscas conexiones puntuales por interés, Pick te ayuda a encontrar a la persona correcta sin ruido.",
    items: [
      {
        title: "Ciudad nueva, círculo nuevo",
        description:
          "Cuando llegas a una ciudad y no conoces a nadie, Pick te conecta con personas que comparten tu plan.",
      },
      {
        title: "Interés específico",
        description:
          "Si ya tienes amigos pero te falta alguien para un interés puntual (como jazz), Pick te ayuda a encontrar esa conexión.",
      },
      {
        title: "Networking con intención",
        description:
          "Conecta con personas afines por industria, objetivo y ciudad para conversaciones y colaboración real.",
      },
    ],
    closingCta: {
      label: "Quiero probar Pick",
      href: "/app",
    },
  },
};

export default es;
