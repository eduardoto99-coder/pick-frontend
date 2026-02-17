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
    displayName: string;
    bio: string;
    whatsappNumber: string;
    linkedin: string;
    instagram: string;
    photo: string;
    citiesMin: string;
    citiesMax: string;
    interestsRange: string;
    interestsInvalid: string;
  }
> = {
  es: {
    displayName: `El nombre visible debe tener entre ${DISPLAY_NAME_LIMIT.min} y ${DISPLAY_NAME_LIMIT.max} caracteres.`,
    bio: `Comparte entre ${BIO_CHARACTER_LIMIT.min} y ${BIO_CHARACTER_LIMIT.max} caracteres para contextualizar tus matches.`,
    whatsappNumber: "Ingresa tu WhatsApp con indicativo y un numero valido.",
    linkedin: `El perfil de LinkedIn debe tener máximo ${SOCIAL_LINK_LIMIT.max} caracteres.`,
    instagram: `El perfil de Instagram debe tener máximo ${SOCIAL_LINK_LIMIT.max} caracteres.`,
    photo: "Sube una foto clara para reforzar confianza.",
    citiesMin: "Selecciona al menos una ciudad donde puedas reunirte.",
    citiesMax: `Elige máx. ${CITY_SELECTION_LIMIT.max} ciudades para mantener foco.`,
    interestsRange: `Selecciona entre ${INTEREST_LIMIT.min} y ${INTEREST_LIMIT.max} intereses.`,
    interestsInvalid: "Selecciona intereses de la lista de Pick.",
  },
  en: {
    displayName: `Display name must contain between ${DISPLAY_NAME_LIMIT.min} and ${DISPLAY_NAME_LIMIT.max} characters.`,
    bio: `Share between ${BIO_CHARACTER_LIMIT.min} and ${BIO_CHARACTER_LIMIT.max} characters to contextualize your matches.`,
    whatsappNumber: "Enter your WhatsApp with country code and a valid number.",
    linkedin: `LinkedIn profiles must be at most ${SOCIAL_LINK_LIMIT.max} characters.`,
    instagram: `Instagram profiles must be at most ${SOCIAL_LINK_LIMIT.max} characters.`,
    photo: "Upload a clear photo to build trust.",
    citiesMin: "Select at least one city where you can meet.",
    citiesMax: `Choose up to ${CITY_SELECTION_LIMIT.max} cities to stay focused.`,
    interestsRange: `Select between ${INTEREST_LIMIT.min} and ${INTEREST_LIMIT.max} interests.`,
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
    errors.displayName = messages.displayName;
  }

  const bioLength = draft.bio.trim().length;
  if (bioLength < BIO_CHARACTER_LIMIT.min || bioLength > BIO_CHARACTER_LIMIT.max) {
    errors.bio = messages.bio;
  }

  const whatsappRaw = draft.whatsappNumber.trim();
  if (whatsappRaw.length === 0) {
    errors.whatsappNumber = messages.whatsappNumber;
  } else if (whatsappRaw.length > WHATSAPP_NUMBER_LIMIT.max) {
    errors.whatsappNumber = messages.whatsappNumber;
  } else {
    const digitCount = whatsappRaw.replace(/\D/g, "").length;
    const validShape = /^\+?[0-9()\-\s]+$/.test(whatsappRaw);
    if (
      !validShape ||
      digitCount < WHATSAPP_NUMBER_LIMIT.minDigits ||
      digitCount > WHATSAPP_NUMBER_LIMIT.maxDigits
    ) {
      errors.whatsappNumber = messages.whatsappNumber;
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
  if (interestCount < INTEREST_LIMIT.min || interestCount > INTEREST_LIMIT.max) {
    errors.interests = messages.interestsRange;
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
