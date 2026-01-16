import type { LandingDictionary } from "../types";

const es: LandingDictionary = {
  hero: {
    id: "inicio",
    title: "Pick escribe tu intro y te conecta con quien vibra igual para ese plan.",
    description: "",
    primaryCta: {
      label: "Empieza con Pick",
      href: "/app",
    },
    secondaryCta: {
      label: "Cómo funciona Pick",
      href: "#journey",
    },
    differentiators: [
      "Mensaje inicial generado por IA, listo para enviar",
      "Matches activos en la ciudad que visites, sin suscripción",
      "Cruce de intereses y horarios para moverse rápido",
    ],
    cardTitle: "Cómo te llevamos al encuentro",
    cardPoints: [
      "Describe el plan y la ciudad; afina mood, zona y fecha.",
      "Pick encuentra a quien busca lo mismo y redacta el intro automático en tu voz.",
      "Abres el chat, envías y cierran lugar y hora en minutos.",
    ],
    messagePreviewLabel: "Así llega el mensaje automático",
    messagePreview:
      "Hey Ana, soy Edu. ¿Nos vemos en el rooftop de Laureles el viernes 8pm? Reservo mesa y llevo playlist; si te sirve te mando la ubicación.",
  },
  journey: {
    id: "journey",
    title: 'Tres pasos de "¿con quién?" a "ya está el chat".',
    description: "Diseñado para definir el plan, conectar y chatear sin fricción.",
    steps: [
      {
        title: "1. Di el plan",
        description: "Selecciona ciudad y actividad (fiesta, deportes, networking, exploración).",
      },
      {
        title: "2. Pick escribe y abre el intro",
        description:
          "La IA cruza intereses y horarios, elige el match y deja el mensaje automático listo para enviar.",
      },
      {
        title: "3. Vivan el plan y cuéntanos",
        description: "Cierren lugar y hora en el chat y comparte feedback para el próximo plan.",
      },
    ],
  },
  socialProof: {
    id: "social-proof",
    title: "Personas reales creando colaboraciones y amistades duraderas.",
    subtitle:
      "Profesionales híbridos, creativos y anfitriones locales usan Pick para encontrar aliados con intención.",
    disclaimer: "Historias representativas; nombres y detalles modificados.",
    stories: [
      {
        quote:
          "Llegué sola a París y quería rumba. Pick me presentó a Luc y terminamos en un bar en Le Marais bailando hasta el cierre.",
        name: "Carla · Creadora de contenido",
        role: "París",
      },
      {
        quote:
          "Conocí a Sam a través de Pick; ambos queríamos lanzar un producto de inteligencia artificial para logística y ahora dirigimos una startup entre Madrid y São Paulo.",
        name: "Camila · CTO en formación",
        role: "Madrid",
      },
      {
        quote:
          "Mientras trabajaba remoto en Vancouver buscaba alguien para planes outdoors. Pick me conectó con Laura y cada domingo exploramos un nuevo sendero.",
        name: "Diego · Product Manager",
        role: "Vancouver",
      },
    ],
  },
  highlights: {
    id: "destacados",
    title: "Por qué Pick acelera tus planes uno a uno.",
    description: "IA + cuidado humano para conectar y dejarte un intro listo para enviar.",
    items: [
      {
        title: "Planificación centrada en actividades",
        description:
          "Elige la vibra y la ciudad; coordinamos timing y afinidad para sugerirte la dupla ideal.",
      },
      {
        title: "Inteligencia artificial que desbloquea conversaciones",
        description:
          "Recibe intros con contexto y primer movimiento, ya listos para enviar.",
      },
      {
        title: "Momentum continuo",
        description:
          "Tus comentarios reactivan nuevas sugerencias y recordatorios suaves para que el plan suceda.",
      },
    ],
    closingCta: {
      label: "Planifica tu próximo encuentro",
      href: "/app",
    },
  },
};

export default es;
