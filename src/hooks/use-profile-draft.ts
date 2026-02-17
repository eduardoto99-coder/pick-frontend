import { useCallback, useEffect, useMemo, useState } from "react";

import { DEFAULT_PROFILE_DRAFT, CITY_SELECTION_LIMIT } from "@/constants/profile";
import { defaultLocale, isLocale } from "@/i18n/config";
import { fetchProfile, persistProfile } from "@/services/profile-service";
import { getStoredDisplayName, persistStoredDisplayName } from "@/utils/local-user";
import {
  validateProfileDraft,
  toggleInterestSelection,
  canSelectInterest,
  isInterestSelected,
} from "@/utils/profile-validation";
import type { Locale } from "@/i18n/types";
import type { ProfileDraft, ProfileValidationResult } from "@/types/profile";

type ProfileStatus = "idle" | "saving" | "saved" | "error";

const draftMessages: Record<
  Locale,
  {
    fileReadError: string;
    validationError: string;
    saveError: string;
  }
> = {
  es: {
    fileReadError: "No se pudo leer la imagen.",
    validationError: "Revisa los campos marcados para completar tu perfil.",
    saveError: "Tuvimos un problema guardando tu perfil.",
  },
  en: {
    fileReadError: "We couldn’t read that image file.",
    validationError: "Check the highlighted fields to complete your profile.",
    saveError: "We had an issue saving your profile.",
  },
};

function fileToDataUrl(file: File, errorMessage: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(errorMessage));
    reader.readAsDataURL(file);
  });
}

export function useProfileDraft(locale?: string) {
  const resolvedLocale = isLocale(locale) ? (locale as Locale) : defaultLocale;
  const messages = useMemo(() => draftMessages[resolvedLocale], [resolvedLocale]);
  const [draft, setDraft] = useState<ProfileDraft>(DEFAULT_PROFILE_DRAFT);
  const [status, setStatus] = useState<ProfileStatus>("idle");
  const [submitError, setSubmitError] = useState<string>();
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);

  const validation = useMemo<ProfileValidationResult>(
    () => validateProfileDraft(draft, resolvedLocale),
    [draft, resolvedLocale],
  );

  const updateField = useCallback(<K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const setPhoto = useCallback(
    async (file: File | null) => {
      if (!file) {
        setDraft((prev) => ({ ...prev, photo: undefined, existingPhotoUrl: undefined }));
        return;
      }

      const dataUrl = await fileToDataUrl(file, messages.fileReadError);
      setDraft((prev) => ({
        ...prev,
        photo: {
          dataUrl,
          fileName: file.name,
          fileSize: file.size,
          lastModified: file.lastModified,
        },
      }));
    },
    [messages.fileReadError, setDraft],
  );

  const updateCities = useCallback(
    (cities: string[]) => {
      if (cities.length > CITY_SELECTION_LIMIT.max) {
        return;
      }

      setDraft((prev) => ({ ...prev, cities }));
    },
    [setDraft],
  );

  const toggleInterest = useCallback((id: string) => {
    setDraft((prev) => toggleInterestSelection(id, prev));
  }, []);

  const submitProfile = useCallback(async () => {
    setAttemptedSubmit(true);
    const result = validateProfileDraft(draft, resolvedLocale);
    if (!result.isValid) {
      setSubmitError(messages.validationError);
      return false;
    }

    try {
      setStatus("saving");
      setSubmitError(undefined);
      const result = await persistProfile(draft);
      persistStoredDisplayName(draft.displayName.trim());
      setDraft((prev) => ({
        ...prev,
        updatedAt: result.updatedAt ?? new Date().toISOString(),
      }));
      setStatus("saved");
      return true;
    } catch (error) {
      setStatus("error");
      setSubmitError(error instanceof Error ? error.message : messages.saveError);
      return false;
    }
  }, [draft, messages.saveError, messages.validationError, resolvedLocale]);

  useEffect(() => {
    if (status !== "saved") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setStatus("idle");
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [status]);

  useEffect(() => {
    const storedName = getStoredDisplayName()?.trim();
    if (!storedName) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft((prev) => {
      if (prev.displayName.trim().length > 0) {
        return prev;
      }
      return {
        ...prev,
        displayName: storedName,
      };
    });
  }, []);

  useEffect(() => {
    async function loadProfile() {
      try {
        const existing = await fetchProfile();
        if (!existing) return;

        const normalizedDisplayName = existing.displayName?.trim() ?? "";
        if (normalizedDisplayName) {
          persistStoredDisplayName(normalizedDisplayName);
        }

        setDraft((prev) => ({
          ...prev,
          displayName: normalizedDisplayName || prev.displayName,
          bio: existing.bio || prev.bio,
          whatsappNumber: existing.whatsappNumber ?? prev.whatsappNumber,
          linkedinUrl: existing.linkedinUrl ?? prev.linkedinUrl,
          instagramUrl: existing.instagramUrl ?? prev.instagramUrl,
          cities: existing.cities ?? [],
          interests: existing.interests ?? [],
          existingPhotoUrl: existing.photoUrl,
          updatedAt: existing.updatedAt,
        }));
        setHasLoadedProfile(true);
      } catch {
        // Silently ignore load errors; user can still edit and save.
      }
    }

    loadProfile();
  }, []);

  return {
    draft,
    validation,
    status,
    submitError,
    attemptedSubmit,
    hasLoadedProfile,
    updateField,
    setPhoto,
    updateCities,
    toggleInterest,
    submitProfile,
    isInterestSelected: (id: string) => isInterestSelected(draft, id),
    canSelectInterest: () => canSelectInterest(draft),
  };
}
