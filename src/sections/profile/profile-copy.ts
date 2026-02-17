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
    whatsappLabel: string;
    whatsappPlaceholder: string;
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
    createOptionLabel: string;
    noOptionsText: string;
    counterLabel: string;
    limitReachedLabel: string;
  };
  locations: {
    title: string;
    helper: string;
    primaryTagLabel: string;
    counterLabel: string;
    limitReachedLabel: string;
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
    emptyTitle: string;
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
      whatsappLabel: "WhatsApp (opcional)",
      whatsappPlaceholder: "Ej. +573001234567",
      linkedinLabel: "LinkedIn (opcional)",
      linkedinPlaceholder: "Ej. https://www.linkedin.com/in/tuusuario",
      instagramLabel: "Instagram (opcional)",
      instagramPlaceholder: "Ej. https://instagram.com/tuusuario",
      socialHelper: "Si agregas tu WhatsApp, Pick puede abrir el chat directo con tu match.",
      interestsLabel: "Buscar intereses",
      interestsPlaceholder: "Escribe para buscar o crear uno personalizado",
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
      helper: "Escribe para buscar o crear un interés personalizado.",
      pendingNotice:
        "Ingresaste un interés personalizado. Lo revisaremos para confirmar que cumple los términos de Pick.",
      createOptionLabel: "Agregar interés personalizado",
      noOptionsText: "No encontramos coincidencias. Presiona Enter para crear uno nuevo.",
      counterLabel: "Intereses: {count}/{max}",
      limitReachedLabel: "Llegaste al máximo de {max} intereses.",
    },
  locations: {
    title: "Ciudades",
    helper: "Selecciona hasta {max} ciudades donde puedas reunirte.",
    primaryTagLabel: " · Principal",
    counterLabel: "Ciudades: {count}/{max}",
    limitReachedLabel: "Llegaste al máximo de {max} ciudades.",
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
    emptyTitle: "Sin sugerencias por ahora",
    empty:
      "Pick cruza tus intereses y ciudades con otras personas. Si no hay coincidencias compatibles aún, seguiremos buscando y verás nuevas sugerencias cuando aparezcan.",
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
      whatsappLabel: "WhatsApp (optional)",
      whatsappPlaceholder: "e.g., +573001234567",
      linkedinLabel: "LinkedIn (optional)",
      linkedinPlaceholder: "e.g., https://www.linkedin.com/in/yourhandle",
      instagramLabel: "Instagram (optional)",
      instagramPlaceholder: "e.g., https://instagram.com/yourhandle",
      socialHelper: "If you add WhatsApp, Pick can open a direct chat with your match.",
      interestsLabel: "Search interests",
      interestsPlaceholder: "Type to search or create a custom one",
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
      helper: "Type to search or create a custom interest.",
      pendingNotice:
        "You added a custom interest. We'll review it to confirm it follows Pick's terms.",
      createOptionLabel: "Add a custom interest",
      noOptionsText: "No matches found. Press Enter to create a new one.",
      counterLabel: "Interests: {count}/{max}",
      limitReachedLabel: "You reached the maximum of {max} interests.",
    },
  locations: {
    title: "Cities",
    helper: "Select up to {max} cities where you can meet.",
    primaryTagLabel: " · Primary",
    counterLabel: "Cities: {count}/{max}",
    limitReachedLabel: "You reached the maximum of {max} cities.",
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
      emptyTitle: "No suggestions yet",
      empty:
        "Pick matches your interests and cities with other people. If there are no compatible matches yet, we’ll keep searching and show new suggestions as they appear.",
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
