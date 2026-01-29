import { defaultLocale, isLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/types";

type MatchCompatibility = "perfect" | "strong" | "compatible";

export type ProfileCopy = {
  title: string;
  subtitle: string;
  fields: {
    nameLabel: string;
    namePlaceholder: string;
    bioLabel: string;
    bioPlaceholder: string;
    bioCounterLabel: string;
    linkedinLabel: string;
    linkedinPlaceholder: string;
    instagramLabel: string;
    instagramPlaceholder: string;
    socialHelper: string;
    interestsLabel: string;
    interestsPlaceholder: string;
    citiesLabel: string;
    citiesPlaceholder: string;
    photoAltFallback: string;
  };
  wizard: {
    nextLabel: string;
    previousLabel: string;
  };
  bio: {
    title: string;
    helper: string;
  };
  photo: {
    title: string;
    helper: string;
    uploadLabel: string;
    removeLabel: string;
  };
  interests: {
    title: string;
    helper: string;
    pendingNotice: string;
  };
  locations: {
    title: string;
    helper: string;
    primaryTagLabel: string;
  };
  summary: {
    title: string;
    helper: string;
    saveLabel: string;
    savingLabel: string;
    savedLabel: string;
  };
  matches: {
    title: string;
    helper: string;
    newTitle: string;
    newEmpty: string;
    connectedTitle: string;
    connectedEmpty: string;
    loading: string;
    empty: string;
    error: string;
    cta: string;
    ctaLoading: string;
    lockedMessage: string;
    compatibilityLabels: Record<MatchCompatibility, string>;
  };
  report: {
    ctaLabel: string;
    dialogTitle: string;
    dialogHelper: string;
    reasonLabel: string;
    reasonPlaceholder: string;
    cancelLabel: string;
    submitLabel: string;
    sendingLabel: string;
    successLabel: string;
    errorLabel: string;
  };
};

const copy: Record<Locale, ProfileCopy> = {
  es: {
    title: "Perfil",
    subtitle: "",
    fields: {
      nameLabel: "Nombre visible",
      namePlaceholder: "Ej. Laura Rivera",
      bioLabel: "Bio",
      bioPlaceholder: "Qué proyectos lideras, qué buscas y qué te entusiasma en esta etapa.",
      bioCounterLabel: "caracteres",
      linkedinLabel: "LinkedIn (opcional)",
      linkedinPlaceholder: "Ej. https://www.linkedin.com/in/tuusuario",
      instagramLabel: "Instagram (opcional)",
      instagramPlaceholder: "Ej. https://instagram.com/tuusuario",
      socialHelper: "",
      interestsLabel: "Buscar intereses",
      interestsPlaceholder: "Escribe para buscar o proponer uno nuevo",
      citiesLabel: "Ciudades",
      citiesPlaceholder: "Bogotá, Medellín...",
      photoAltFallback: "Foto de perfil",
    },
    wizard: {
      nextLabel: "Siguiente paso",
      previousLabel: "Paso anterior",
  },
  bio: {
    title: "Bio y contexto",
    helper: "",
  },
  photo: {
    title: "Foto de perfil",
    helper: "",
    uploadLabel: "Subir foto",
    removeLabel: "Quitar foto",
  },
  interests: {
    title: "Intereses",
    helper: "",
    pendingNotice:
      "Ingresaste un interés personalizado. Lo revisaremos para confirmar que cumple los términos de Pick.",
  },
  locations: {
    title: "Ciudades",
    helper: "",
    primaryTagLabel: " · Principal",
  },
  summary: {
      title: "Revisión y guardado",
      helper: "Verifica tu estado antes de solicitar matches o mentorías.",
      saveLabel: "Guardar perfil",
      savingLabel: "Guardando...",
      savedLabel: "Perfil guardado",
  },
  matches: {
    title: "Sugerencias",
    helper: "Los planes de Pick siempre se proponen en lugares públicos para interacciones seguras.",
    newTitle: "Nuevas sugerencias",
    newEmpty: "Aún no tienes nuevas sugerencias.",
    connectedTitle: "Relaciones iniciadas",
    connectedEmpty: "Aún no has enviado un mensaje por WhatsApp.",
    loading: "Buscando coincidencias compatibles...",
    empty: "Completa tu perfil para desbloquear sugerencias.",
      error: "No pudimos cargar tus coincidencias. Intenta nuevamente.",
      cta: "Abrir en WhatsApp",
      ctaLoading: "Generando intro...",
      lockedMessage: "Completa y guarda tu perfil para desbloquear tus matches personalizados.",
      compatibilityLabels: {
        perfect: "",
        strong: "",
        compatible: "",
      },
    },
    report: {
      ctaLabel: "Reportar",
      dialogTitle: "Reportar usuario",
      dialogHelper: "Cuéntanos qué pasó. Revisaremos el caso lo antes posible.",
      reasonLabel: "Motivo (opcional)",
      reasonPlaceholder: "Ej. spam, comportamiento inapropiado...",
      cancelLabel: "Cancelar",
      submitLabel: "Enviar reporte",
      sendingLabel: "Enviando...",
      successLabel: "Reporte enviado. Gracias por ayudarnos a mantener Pick seguro.",
      errorLabel: "No pudimos enviar el reporte. Intenta nuevamente.",
    },
  },
  en: {
    title: "Profile",
    subtitle: "",
    fields: {
      nameLabel: "Display name",
      namePlaceholder: "e.g., Laura Rivera",
      bioLabel: "Bio",
      bioPlaceholder: "Share what you’re building, looking for, and excited about right now.",
      bioCounterLabel: "characters",
      linkedinLabel: "LinkedIn (optional)",
      linkedinPlaceholder: "e.g., https://www.linkedin.com/in/yourhandle",
      instagramLabel: "Instagram (optional)",
      instagramPlaceholder: "e.g., https://instagram.com/yourhandle",
      socialHelper: "",
      interestsLabel: "Search interests",
      interestsPlaceholder: "Type to search or propose a new one",
      citiesLabel: "Cities",
      citiesPlaceholder: "Bogotá, Medellín...",
      photoAltFallback: "Profile photo",
    },
    wizard: {
      nextLabel: "Next step",
      previousLabel: "Previous step",
  },
  bio: {
    title: "Bio & context",
    helper: "",
  },
  photo: {
    title: "Profile photo",
    helper: "",
    uploadLabel: "Upload photo",
    removeLabel: "Remove photo",
  },
  interests: {
    title: "Interests",
    helper: "",
    pendingNotice:
      "You added a custom interest. We'll review it to confirm it follows Pick's terms.",
  },
  locations: {
    title: "Cities",
    helper: "",
    primaryTagLabel: " · Primary",
  },
  summary: {
      title: "Review & save",
      helper: "Double-check your status before requesting matches or mentorships.",
      saveLabel: "Save profile",
      savingLabel: "Saving...",
      savedLabel: "Profile saved",
  },
  matches: {
    title: "Suggestions",
    helper: "Pick plans are always proposed in public places for safer interactions.",
    newTitle: "New suggestions",
    newEmpty: "You have no new suggestions yet.",
    connectedTitle: "Connections started",
    connectedEmpty: "You haven’t opened WhatsApp for a suggestion yet.",
    loading: "Curating compatible matches...",
      empty: "Complete your profile to unlock recommendations.",
      error: "We couldn’t load your matches. Try again shortly.",
      cta: "Open in WhatsApp",
      ctaLoading: "Drafting intro...",
      lockedMessage: "Complete and save your profile to unlock personalized matches.",
      compatibilityLabels: {
        perfect: "",
        strong: "",
        compatible: "",
      },
    },
    report: {
      ctaLabel: "Report",
      dialogTitle: "Report user",
      dialogHelper: "Tell us what happened. We’ll review the report ASAP.",
      reasonLabel: "Reason (optional)",
      reasonPlaceholder: "e.g., spam, inappropriate behavior...",
      cancelLabel: "Cancel",
      submitLabel: "Submit report",
      sendingLabel: "Sending...",
      successLabel: "Report sent. Thanks for helping keep Pick safe.",
      errorLabel: "We couldn’t send the report. Try again.",
    },
  },
};

export function getProfileCopy(locale: string | undefined): ProfileCopy {
  const resolved = isLocale(locale) ? (locale as Locale) : defaultLocale;
  return copy[resolved];
}
