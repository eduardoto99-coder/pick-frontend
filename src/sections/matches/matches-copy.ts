import { defaultLocale, isLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/types";

type MatchCompatibility = "perfect" | "strong" | "compatible";
export type FeedbackOutcome =
  | "no_response"
  | "chatting"
  | "planning_to_meet"
  | "met_in_person"
  | "no_show"
  | "other";

type FeedbackMilestoneId = "day_2" | "month_1" | "month_6";

type FeedbackCopy = {
  title: string;
  description: string;
  milestonePrefix: string;
  milestoneLabels: Record<FeedbackMilestoneId, string>;
  ratingLabel: string;
  ratingHelper: string;
  outcomeLabel: string;
  outcomeOptions: Record<FeedbackOutcome, string>;
  matchCodeLabel: string;
  commentLabel: string;
  submitCta: string;
  submitLoading: string;
  skipCta: string;
  submitted: string;
  error: string;
};

export type MatchesDashboardCopy = {
  title: string;
  subtitle: string;
  refreshCta: string;
  incompleteProfileMessage: string;
  incompleteCta: string;
  status: {
    loading: string;
    empty: string;
    error: string;
    updatedPrefix: string;
  };
  card: {
    sharedCitiesLabel: string;
    sharedInterestsLabel: string;
    previewLabel: string;
    sponsorBadge: string;
    noPreview: string;
    matchCodeLabel: string;
  };
  actions: {
    open: string;
    openLoading: string;
    copy: string;
    copySuccess: string;
    copyError: string;
    refreshPreview: string;
    refreshingPreview: string;
  };
  compatibilityLabels: Record<MatchCompatibility, string>;
  feedback: FeedbackCopy;
};

const copy: Record<Locale, MatchesDashboardCopy> = {
  es: {
    title: "Dashboard de matches",
    subtitle:
      "Valida cada sugerencia, revisa el mensaje generado con inteligencia artificial y coordina el handoff en minutos.",
    refreshCta: "Actualizar sugerencias",
    incompleteProfileMessage:
      "Completa y guarda tu perfil para ver tus matches. Esto asegura que las recomendaciones tengan tu bio, foto, intereses y ciudades correctas.",
    incompleteCta: "Ir a mi perfil",
    status: {
      loading: "Mapeando tus coincidencias personalizadas...",
      empty: "Completa tu perfil con ciudades e intereses para recibir nuevos matches.",
      error: "No pudimos cargar las coincidencias. Intenta nuevamente pronto.",
      updatedPrefix: "Actualizado",
    },
    card: {
      sharedCitiesLabel: "Ciudades en común",
      sharedInterestsLabel: "Intereses en común",
      previewLabel: "Intro sugerida por inteligencia artificial",
      sponsorBadge: "Patrocinado",
      noPreview: "No pudimos preparar un intro para este match. Refresca la sugerencia.",
      matchCodeLabel: "Código de match",
    },
    actions: {
      open: "Abrir en WhatsApp",
      openLoading: "Abriendo...",
      copy: "Copiar intro",
      copySuccess: "Intro copiada",
      copyError: "No se pudo copiar",
      refreshPreview: "Refrescar intro",
      refreshingPreview: "Refrescando...",
    },
    compatibilityLabels: {
      perfect: "Perfecto",
      strong: "Fuerte",
      compatible: "Compatible",
    },
    feedback: {
      title: "¿Cómo te fue con las intros?",
      description: "Cuéntanos cómo sientes los mensajes de WhatsApp para seguir afinando la experiencia.",
      milestonePrefix: "Feedback solicitado",
      milestoneLabels: {
        day_2: "a los 2 días",
        month_1: "al mes",
        month_6: "a los 6 meses",
      },
      ratingLabel: "Calificación del mensaje (1-5)",
      ratingHelper: "Evalúa qué tan útil/aterrizado estuvo el intro sugerido.",
      outcomeLabel: "¿Qué pasó después?",
      outcomeOptions: {
        no_response: "No hubo respuesta",
        chatting: "Seguimos chateando",
        planning_to_meet: "Estamos planeando vernos",
        met_in_person: "Nos vimos en persona",
        no_show: "Hubo plantón / no se concretó",
        other: "Otro",
      },
      matchCodeLabel: "Código de match (opcional)",
      commentLabel: "Comentario (opcional)",
      submitCta: "Enviar feedback",
      submitLoading: "Enviando...",
      skipCta: "Ahora no",
      submitted: "¡Gracias! Registramos tu feedback.",
      error: "No pudimos guardar tu feedback. Intenta de nuevo.",
    },
  },
  en: {
    title: "Matches dashboard",
    subtitle:
      "Review every suggestion, scan the intro crafted with artificial intelligence, and hand off on WhatsApp confidently.",
    refreshCta: "Refresh suggestions",
    incompleteProfileMessage:
      "Complete and save your profile to see your matches. This keeps your bio, photo, interests, and cities in sync.",
    incompleteCta: "Go to my profile",
    status: {
      loading: "Curating compatible matches...",
      empty: "Complete your profile with cities and interests to unlock new matches.",
      error: "We couldn’t load your matches. Try again shortly.",
      updatedPrefix: "Updated",
    },
    card: {
      sharedCitiesLabel: "Shared cities",
      sharedInterestsLabel: "Shared interests",
      previewLabel: "Intro crafted with artificial intelligence",
      sponsorBadge: "Sponsored",
      noPreview: "We couldn’t draft an intro for this match yet. Refresh to try again.",
      matchCodeLabel: "Match code",
    },
    actions: {
      open: "Open in WhatsApp",
      openLoading: "Opening...",
      copy: "Copy intro",
      copySuccess: "Intro copied",
      copyError: "Copy failed",
      refreshPreview: "Refresh intro",
      refreshingPreview: "Refreshing...",
    },
    compatibilityLabels: {
      perfect: "Perfect",
      strong: "Strong",
      compatible: "Compatible",
    },
    feedback: {
      title: "How did the intros feel?",
      description: "Tell us how the WhatsApp message landed so we can keep tuning the experience.",
      milestonePrefix: "Feedback window",
      milestoneLabels: {
        day_2: "after 2 days",
        month_1: "after 1 month",
        month_6: "after 6 months",
      },
      ratingLabel: "Message rating (1-5)",
      ratingHelper: "Rate how useful/on-point the intro felt.",
      outcomeLabel: "What happened after?",
      outcomeOptions: {
        no_response: "No response",
        chatting: "Still chatting",
        planning_to_meet: "Planning to meet",
        met_in_person: "Met in person",
        no_show: "No show / fell through",
        other: "Other",
      },
      matchCodeLabel: "Match code (optional)",
      commentLabel: "Comment (optional)",
      submitCta: "Send feedback",
      submitLoading: "Sending...",
      skipCta: "Not now",
      submitted: "Thanks! We recorded your feedback.",
      error: "We couldn’t save your feedback. Please try again.",
    },
  },
};

export function getMatchesCopy(locale: string | undefined): MatchesDashboardCopy {
  const resolved = isLocale(locale) ? (locale as Locale) : defaultLocale;
  return copy[resolved];
}
