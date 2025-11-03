import type { LandingDictionary } from "../types";

const es: LandingDictionary = {
  hero: {
    id: "inicio",
    title: "Encuentra con quién vivir cada plan, en tu ciudad o la que visitas.",
    description:
      "Pick usa IA para entender qué quieres hacer (salir de fiesta, coworkear, explorar) y te conecta con la persona que vibra igual. Recibe un mensaje listo en WhatsApp para confirmar el plan sin awkwardness.",
    primaryCta: {
      label: "Empieza tu plan",
      href: "/app",
    },
    secondaryCta: {
      label: "Cómo funciona Pick",
      href: "#journey",
    },
    differentiators: [
      "Algoritmo con IA que mapea tu mood y energía",
      "Matches preparados para tu próximo plan, en cualquier ciudad",
      "Ideas de actividades y recordatorios para que nadie se quede colgado",
    ],
    cardTitle: "Así te acompañamos en cada encuentro",
    cardPoints: [
      "Describe qué plan quieres (after en Ciudad de México, bar en París, cowork en Lisboa) y cuándo puedes.",
      "Nuestra IA propone icebreakers, playlists y first moves para que el chat fluya de inmediato.",
      "Confirma el plan, comparte cómo salió y desbloquea nuevas combinaciones cuando tengas otro antojo.",
    ],
  },
  journey: {
    id: "journey",
    title: 'Tres pasos para pasar de "¿con quién?" a "nos vemos a las 8".',
    description:
      "Diseñamos cada etapa para que definas tu plan, recibas la mejor dupla y lo vivan sin fricción.",
    steps: [
      {
        title: "1. Cuéntanos el plan",
        description:
          "Elige si buscas fiesta, deportes, networking tech o compañía para explorar una ciudad nueva.",
      },
      {
        title: "2. Deja que la IA haga la magia",
        description:
          "Pick analiza tus gustos, horarios y vibra social para conectarte con la persona perfecta y envía el mensaje introductorio.",
      },
      {
        title: "3. Vivan el plan y cuéntanos",
        description:
          "Confirma el lugar, recibe recordatorios amigables y comparte cómo estuvo para seguir recibiendo planes épicos.",
      },
    ],
  },
  socialProof: {
    id: "social-proof",
    title: "Personas reales creando colaboraciones y amistades duraderas.",
    subtitle:
      "Profesionales híbridos, creativos y anfitriones locales usan Pick para encontrar aliados con intención.",
    stories: [
      {
        quote:
          "Llegué sola a París y quería rumba. Pick me presentó a Luc y terminamos en un bar en Le Marais bailando hasta el cierre.",
        name: "Carla · Creadora de contenido",
        role: "París",
      },
      {
        quote:
          "Conocí a Sam a través de Pick; ambos queríamos lanzar un producto de IA para logística y ahora dirigimos una startup entre Madrid y São Paulo.",
        name: "Camila · CTO en formación",
        role: "Madrid · São Paulo",
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
    title: "Por qué Pick es tu co-piloto ideal de planes uno a uno.",
    description:
      "Combinamos IA con cuidado humano para que solo te preocupes por disfrutar.",
    items: [
      {
        title: "Planificación centrada en actividades",
        description:
          "Selecciona el plan y la ciudad; nosotros cruzamos disponibilidad y afinidad para sugerirte el partner ideal.",
      },
      {
        title: "IA que desbloquea conversaciones",
        description:
          "Recibe mensajes con contexto, playlists y preguntas rompehielo personalizadas según el plan.",
      },
      {
        title: "Momentum continuo",
        description:
          "Tus comentarios activan nuevas sugerencias y te ayudan a mantener una agenda llena de experiencias memorables.",
      },
    ],
    closingCta: {
      label: "Planifica tu próximo encuentro",
      href: "/app",
    },
  },
};

export default es;
