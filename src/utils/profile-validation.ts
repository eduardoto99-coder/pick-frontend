import {
  BIO_CHARACTER_LIMIT,
  CITY_SELECTION_LIMIT,
  DISPLAY_NAME_LIMIT,
  INTEREST_LIMIT,
  SOCIAL_LINK_LIMIT,
  WHATSAPP_NUMBER_LIMIT,
} from "@/constants/profile";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/types";
import type { ProfileDraft, ProfileValidationResult } from "@/types/profile";

const validationMessages: Record<
  Locale,
  {
    displayNameRange: string;
    bioMin: string;
    bioMax: string;
    whatsappRequired: string;
    whatsappLength: string;
    whatsappInvalid: string;
    linkedin: string;
    instagram: string;
    photo: string;
    citiesMin: string;
    citiesMax: string;
    interestsMin: string;
    interestsMax: string;
    interestsInvalid: string;
  }
> = {
  es: {
    displayNameRange: `El nombre visible debe tener entre ${DISPLAY_NAME_LIMIT.min} y ${DISPLAY_NAME_LIMIT.max} caracteres.`,
    bioMin: `Tu bio está muy corta. Escribe al menos ${BIO_CHARACTER_LIMIT.min} caracteres.`,
    bioMax: `Tu bio supera el máximo de ${BIO_CHARACTER_LIMIT.max} caracteres.`,
    whatsappRequired: "Ingresa tu número de WhatsApp para continuar.",
    whatsappLength: `El número de WhatsApp debe tener máximo ${WHATSAPP_NUMBER_LIMIT.max} caracteres.`,
    whatsappInvalid: `Usa un número válido con indicativo (por ejemplo +573001234567).`,
    linkedin: `El perfil de LinkedIn debe tener máximo ${SOCIAL_LINK_LIMIT.max} caracteres.`,
    instagram: `El perfil de Instagram debe tener máximo ${SOCIAL_LINK_LIMIT.max} caracteres.`,
    photo: "Sube una foto clara para reforzar confianza.",
    citiesMin: "Selecciona al menos una ciudad donde puedas reunirte.",
    citiesMax: `Elige máx. ${CITY_SELECTION_LIMIT.max} ciudades para mantener foco.`,
    interestsMin: "Selecciona al menos un interés para activar tus matches.",
    interestsMax: `Selecciona máximo ${INTEREST_LIMIT.max} intereses.`,
    interestsInvalid: "Selecciona intereses de la lista de Pick.",
  },
  en: {
    displayNameRange: `Display name must contain between ${DISPLAY_NAME_LIMIT.min} and ${DISPLAY_NAME_LIMIT.max} characters.`,
    bioMin: `Your bio is too short. Write at least ${BIO_CHARACTER_LIMIT.min} characters.`,
    bioMax: `Your bio exceeds the ${BIO_CHARACTER_LIMIT.max} character limit.`,
    whatsappRequired: "Enter your WhatsApp number to continue.",
    whatsappLength: `WhatsApp number must be at most ${WHATSAPP_NUMBER_LIMIT.max} characters.`,
    whatsappInvalid: `Use a valid number with country code (for example +573001234567).`,
    linkedin: `LinkedIn profiles must be at most ${SOCIAL_LINK_LIMIT.max} characters.`,
    instagram: `Instagram profiles must be at most ${SOCIAL_LINK_LIMIT.max} characters.`,
    photo: "Upload a clear photo to build trust.",
    citiesMin: "Select at least one city where you can meet.",
    citiesMax: `Choose up to ${CITY_SELECTION_LIMIT.max} cities to stay focused.`,
    interestsMin: "Pick at least one interest to unlock your matches.",
    interestsMax: `Pick up to ${INTEREST_LIMIT.max} interests.`,
    interestsInvalid: "Choose interests from Pick’s list.",
  },
};

export function validateProfileDraft(
  draft: ProfileDraft,
  locale: Locale = defaultLocale,
): ProfileValidationResult {
  const messages = validationMessages[locale] ?? validationMessages[defaultLocale];
  const errors: ProfileValidationResult["errors"] = {};

  const displayNameLength = draft.displayName.trim().length;
  if (displayNameLength < DISPLAY_NAME_LIMIT.min || displayNameLength > DISPLAY_NAME_LIMIT.max) {
    errors.displayName = messages.displayNameRange;
  }

  const bioLength = draft.bio.trim().length;
  if (bioLength < BIO_CHARACTER_LIMIT.min) {
    errors.bio = messages.bioMin;
  } else if (bioLength > BIO_CHARACTER_LIMIT.max) {
    errors.bio = messages.bioMax;
  }

  const whatsappRaw = draft.whatsappNumber.trim();
  if (whatsappRaw.length === 0) {
    errors.whatsappNumber = messages.whatsappRequired;
  } else if (whatsappRaw.length > WHATSAPP_NUMBER_LIMIT.max) {
    errors.whatsappNumber = messages.whatsappLength;
  } else {
    const digitCount = whatsappRaw.replace(/\D/g, "").length;
    const validShape = /^\+?[0-9()\-\s]+$/.test(whatsappRaw);
    if (
      !validShape ||
      digitCount < WHATSAPP_NUMBER_LIMIT.minDigits ||
      digitCount > WHATSAPP_NUMBER_LIMIT.maxDigits
    ) {
      errors.whatsappNumber = messages.whatsappInvalid;
    }
  }

  const linkedinLength = draft.linkedinUrl.trim().length;
  if (linkedinLength > SOCIAL_LINK_LIMIT.max) {
    errors.linkedinUrl = messages.linkedin;
  }

  const instagramLength = draft.instagramUrl.trim().length;
  if (instagramLength > SOCIAL_LINK_LIMIT.max) {
    errors.instagramUrl = messages.instagram;
  }

  if (!draft.photo && !draft.existingPhotoUrl) {
    errors.photo = messages.photo;
  }

  if (draft.cities.length < CITY_SELECTION_LIMIT.min) {
    errors.cities = messages.citiesMin;
  } else if (draft.cities.length > CITY_SELECTION_LIMIT.max) {
    errors.cities = messages.citiesMax;
  }

  const interestCount = draft.interests.length;
  if (interestCount < INTEREST_LIMIT.min) {
    errors.interests = messages.interestsMin;
  } else if (interestCount > INTEREST_LIMIT.max) {
    errors.interests = messages.interestsMax;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function canSelectInterest(draft: ProfileDraft): boolean {
  return draft.interests.length < INTEREST_LIMIT.max;
}

export function isInterestSelected(draft: ProfileDraft, id: string): boolean {
  return draft.interests.includes(id);
}

export function toggleInterestSelection(id: string, draft: ProfileDraft): ProfileDraft {
  const alreadySelected = draft.interests.includes(id);

  if (alreadySelected) {
    return {
      ...draft,
      interests: draft.interests.filter((value) => value !== id),
    };
  }

  if (!canSelectInterest(draft)) {
    return draft;
  }

  return {
    ...draft,
    interests: [...draft.interests, id],
  };
}
