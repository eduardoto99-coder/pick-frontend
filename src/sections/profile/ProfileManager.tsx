"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import {
  clearProfileCompleteFlag,
  isProfileMarkedComplete,
  markProfileComplete,
} from "@/utils/local-user";

import { BIO_CHARACTER_LIMIT, CITY_OPTIONS, SOCIAL_LINK_LIMIT } from "@/constants/profile";
import { useProfileDraft } from "@/hooks/use-profile-draft";
import { useAccountLinks } from "@/hooks/use-account-links";
import { getProfileCopy } from "@/sections/profile/profile-copy";
import {
  fetchMatchRecommendations,
  requestMatchIntro,
  type MatchRecommendation,
} from "@/services/matchmaking-service";
import { reportUser } from "@/services/report-service";
import { fetchInterests, resolveInterestLabel, type InterestOption } from "@/services/interest-service";

type ProfileManagerProps = {
  locale?: string;
};

type StepId = "bio" | "photo" | "interests" | "social" | "locations";

const STEP_IDS: StepId[] = ["bio", "photo", "interests", "social", "locations"];

export default function ProfileManager({ locale }: ProfileManagerProps) {
  const router = useRouter();
  const { ready: sessionReady, hasSession, signInHref } = useAccountLinks(locale);
  const copy = getProfileCopy(locale);
  const titleId = "profile-manager-title";
  const subtitleText = copy.subtitle?.trim() ?? "";
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    draft,
    status,
    validation,
    attemptedSubmit,
    submitError,
    updateField,
    setPhoto,
    toggleInterest,
    updateCities,
    submitProfile,
    isInterestSelected,
    canSelectInterest,
    hasLoadedProfile,
  } = useProfileDraft(locale);
  const [attemptedSteps, setAttemptedSteps] = useState<number[]>([]);
  const [hasSavedProfile, setHasSavedProfile] = useState<boolean>(() =>
    typeof window !== "undefined" ? isProfileMarkedComplete() : false,
  );
  const [autoMarkedFromLoad, setAutoMarkedFromLoad] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [reportTarget, setReportTarget] = useState<MatchRecommendation | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportStatus, setReportStatus] = useState<"idle" | "submitting">("idle");
  const [reportError, setReportError] = useState<string>();
  const [reportToast, setReportToast] = useState<string>();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });

  const shouldShowErrors = (index: number) =>
    attemptedSubmit || attemptedSteps.includes(index);

  const showErrorsFor = (id: StepId) => shouldShowErrors(STEP_IDS.indexOf(id));

  const markProfileDirty = () => {
    if (hasSavedProfile) {
      setHasSavedProfile(false);
      clearProfileCompleteFlag();
    }
  };

  const handleSaveProfile = async () => {
    setAttemptedSteps(STEP_IDS.map((_, index) => index));
    const saved = await submitProfile();
    if (saved) {
      markProfileComplete();
      setHasSavedProfile(true);
      setShowSavedToast(true);
      window.setTimeout(() => setShowSavedToast(false), 2000);
    }
  };

  const selectedCities = useMemo(
    () => CITY_OPTIONS.filter((option) => draft.cities.includes(option.id)),
    [draft.cities],
  );

  const photoPreview = draft.photo?.dataUrl ?? draft.existingPhotoUrl;

  const canAddMoreInterests = canSelectInterest();
  const [interestOptions, setInterestOptions] = useState<InterestOption[]>([]);
  const [interestLookup, setInterestLookup] = useState<Record<string, InterestOption>>({});
  const [interestQuery, setInterestQuery] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [interestStatus, setInterestStatus] = useState<"idle" | "loading" | "error">("idle");
  const [interestError, setInterestError] = useState<string>();
  const [pendingInterestIds, setPendingInterestIds] = useState<string[]>([]);
  const [matchRecommendations, setMatchRecommendations] = useState<MatchRecommendation[]>([]);
  const [matchesStatus, setMatchesStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [matchesError, setMatchesError] = useState<string>();
  const [introStatus, setIntroStatus] = useState<
    Record<string, { status: "idle" | "loading" | "error"; message?: string }>
  >({});
  const [enlargedPhoto, setEnlargedPhoto] = useState<{ url: string; name: string } | null>(null);
  const canViewMatches = hasSavedProfile && validation.isValid;
  const reportDialogOpen = Boolean(reportTarget);
  const filterInterestOptions = createFilterOptions<InterestOption>();
  const hasSubtitle = Boolean(subtitleText);
  const hasPendingInterests = pendingInterestIds.some((id) => draft.interests.includes(id));

  useEffect(() => {
    if (!sessionReady) return;
    if (!hasSession) {
      router.replace(signInHref);
    }
  }, [sessionReady, hasSession, router, signInHref]);

  useEffect(() => {
    if (autoMarkedFromLoad) return;
    if (!hasLoadedProfile || !validation.isValid) return;

    if (!hasSavedProfile) {
      markProfileComplete();
      setHasSavedProfile(true);
    }

    setAutoMarkedFromLoad(true);
  }, [autoMarkedFromLoad, hasLoadedProfile, hasSavedProfile, validation.isValid]);

  useEffect(() => {
    let isMounted = true;
    async function loadMatches() {
      try {
        setMatchesStatus("loading");
        const data = await fetchMatchRecommendations(5);
        if (!isMounted) return;
        setMatchRecommendations(data);
        setMatchesError(undefined);
        setMatchesStatus("ready");
      } catch (error) {
        if (!isMounted) return;
        setMatchesError(
          error instanceof Error ? error.message : copy.matches.error,
        );
        setMatchRecommendations([]);
        setMatchesStatus("error");
      }
    }

    if (!sessionReady || !hasSession) {
      return;
    }

    if (canViewMatches) {
      loadMatches();
    } else {
      setMatchRecommendations([]);
      setMatchesStatus("idle");
    }

    return () => {
      isMounted = false;
    };
  }, [canViewMatches, copy.matches.error, hasSession, sessionReady]);

  const handleMatchIntro = async (matchId: string) => {
    setIntroStatus((prev) => ({
      ...prev,
      [matchId]: { status: "loading" },
    }));
    try {
      const intro = await requestMatchIntro(matchId);
      if (typeof window !== "undefined") {
        window.open(intro.whatsappUrl, "_blank", "noopener");
      }
      setIntroStatus((prev) => ({
        ...prev,
        [matchId]: { status: "idle" },
      }));
    } catch (error) {
      setIntroStatus((prev) => ({
        ...prev,
        [matchId]: {
          status: "error",
          message: error instanceof Error ? error.message : undefined,
        },
      }));
    }
  };

  const showReportToast = (message: string) => {
    setReportToast(message);
    window.setTimeout(() => setReportToast(undefined), 2500);
  };

  const openReportDialog = (match: MatchRecommendation) => {
    setReportTarget(match);
    setReportReason("");
    setReportError(undefined);
  };

  const closeReportDialog = () => {
    setReportTarget(null);
    setReportReason("");
    setReportError(undefined);
    setReportStatus("idle");
  };

  const handleReportSubmit = async () => {
    if (!reportTarget || reportStatus === "submitting") {
      return;
    }

    try {
      setReportStatus("submitting");
      setReportError(undefined);
      const reason = reportReason.trim();
      await reportUser({
        reportedUserId: reportTarget.userId,
        reason: reason.length > 0 ? reason : undefined,
        context: "match",
      });
      closeReportDialog();
      showReportToast(copy.report.successLabel);
    } catch (error) {
      setReportStatus("idle");
      setReportError(error instanceof Error ? error.message : copy.report.errorLabel);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    markProfileDirty();
    await setPhoto(file ?? null);
    event.target.value = "";
  };

  const mergeInterestOptions = (options: InterestOption[]) => {
    setInterestOptions((prev) => {
      const map = new Map<string, InterestOption>();
      for (const option of [...prev, ...options]) {
        map.set(option.id, option);
      }
      return Array.from(map.values());
    });
    setInterestLookup((prev) => {
      const next = { ...prev };
      for (const option of options) {
        next[option.id] = option;
      }
      return next;
    });
  };

  const loadInterestOptions = useCallback(
    async (query: string) => {
      try {
        setInterestStatus("loading");
        const results = await fetchInterests(query);
        mergeInterestOptions(results);
        setInterestStatus("idle");
        setInterestError(undefined);
      } catch (error) {
        setInterestStatus("error");
        setInterestError(error instanceof Error ? error.message : copy.matches.error);
      }
    },
    [copy.matches.error],
  );

  useEffect(() => {
    loadInterestOptions("");
  }, [loadInterestOptions]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadInterestOptions(interestQuery);
    }, 200);
    return () => window.clearTimeout(timeout);
  }, [interestQuery, loadInterestOptions]);

  const addInterestByOption = (option: InterestOption) => {
    if (isInterestSelected(option.id) || !canAddMoreInterests) {
      return;
    }
    markProfileDirty();
    toggleInterest(option.id);
    setInterestLookup((prev) => ({ ...prev, [option.id]: option }));
  };

  const addInterestByLabel = async (label: string) => {
    if (!canAddMoreInterests) return;
    if (!label.trim()) return;
    try {
      setInterestStatus("loading");
      const result = await resolveInterestLabel(label.trim());
      const option: InterestOption = {
        id: result.interestId,
        label: result.label,
      };
      if (result.created) {
        setPendingInterestIds((prev) =>
          prev.includes(option.id) ? prev : [...prev, option.id],
        );
      }
      mergeInterestOptions([option, ...interestOptions]);
      addInterestByOption(option);
      setInterestStatus("idle");
      setInterestError(undefined);
      setInterestQuery("");
      setInterestInput("");
    } catch (error) {
      setInterestStatus("error");
      setInterestError(error instanceof Error ? error.message : copy.matches.error);
    }
  };

  const renderStepContent = (stepId: StepId, showErrorsForStep: boolean) => {
    switch (stepId) {
      case "bio":
        return (
          <Stack spacing={3}>
            <TextField
              label={copy.fields.bioLabel}
              multiline
              minRows={8}
              value={draft.bio}
              placeholder={copy.fields.bioPlaceholder}
              onChange={(event) => {
                markProfileDirty();
                updateField("bio", event.target.value);
              }}
              fullWidth
              error={showErrorsForStep && Boolean(validation.errors.bio)}
              helperText={
                showErrorsForStep
                  ? validation.errors.bio
                  : `${draft.bio.trim().length}/${BIO_CHARACTER_LIMIT.max} ${copy.fields.bioCounterLabel}`
              }
            />
          </Stack>
        );
      case "social":
        const socialHelper = copy.fields.socialHelper?.trim() ?? "";
        return (
          <Stack spacing={0}>
            <TextField
              label={copy.fields.linkedinLabel}
              value={draft.linkedinUrl}
              placeholder={copy.fields.linkedinPlaceholder}
              onChange={(event) => {
                markProfileDirty();
                updateField("linkedinUrl", event.target.value);
              }}
              fullWidth
              error={showErrorsForStep && Boolean(validation.errors.linkedinUrl)}
              inputProps={{ maxLength: SOCIAL_LINK_LIMIT.max }}
              helperText={
                showErrorsForStep && validation.errors.linkedinUrl
                  ? validation.errors.linkedinUrl
                  : socialHelper || undefined
              }
            />
            <TextField
              label={copy.fields.instagramLabel}
              value={draft.instagramUrl}
              placeholder={copy.fields.instagramPlaceholder}
              sx={{ mt: "1cm" }}
              onChange={(event) => {
                markProfileDirty();
                updateField("instagramUrl", event.target.value);
              }}
              fullWidth
              error={showErrorsForStep && Boolean(validation.errors.instagramUrl)}
              inputProps={{ maxLength: SOCIAL_LINK_LIMIT.max }}
              helperText={
                showErrorsForStep && validation.errors.instagramUrl
                  ? validation.errors.instagramUrl
                  : socialHelper || undefined
              }
            />
          </Stack>
        );
      case "photo":
        return (
          <Stack spacing={3}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems="center">
              {photoPreview ? (
                <Avatar
                  src={photoPreview}
                  alt={draft.displayName || copy.fields.photoAltFallback}
                  sx={{ width: 140, height: 140 }}
                />
              ) : (
                <Avatar sx={{ width: 140, height: 140, bgcolor: "primary.light" }}>
                  <PhotoCameraIcon />
                </Avatar>
              )}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                />
                <Button variant="contained" startIcon={<PhotoCameraIcon />} onClick={handlePhotoClick}>
                  {copy.photo.uploadLabel}
                </Button>
              {photoPreview && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => {
                    markProfileDirty();
                    setPhoto(null);
                  }}
                >
                  {copy.photo.removeLabel}
                </Button>
              )}
            </Stack>
            </Stack>
            {showErrorsForStep && validation.errors.photo && (
              <Alert severity="warning">{validation.errors.photo}</Alert>
            )}
          </Stack>
        );
      case "interests":
        return (
          <Stack spacing={3}>
            <Autocomplete
              freeSolo
              value={null}
              options={interestOptions}
              getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
              loading={interestStatus === "loading"}
              inputValue={interestInput}
              onInputChange={(_, value) => {
                setInterestInput(value);
                setInterestQuery(value);
              }}
              onChange={(_, value) => {
                if (typeof value === "string") {
                  addInterestByLabel(value);
                } else if (value && "id" in value) {
                  addInterestByOption(value);
                }
                setInterestInput("");
                setInterestQuery("");
              }}
              filterOptions={(options, state) => {
                // Client-side filter to complement server search results.
                if (!state.inputValue.trim()) return options;
                const query = state.inputValue.trim().toLowerCase();
                return filterInterestOptions(options, {
                  ...state,
                  getOptionLabel: (option) =>
                    typeof option === "string" ? option : option.label ?? "",
                  inputValue: query,
                }).filter((option) =>
                  (typeof option === "string" ? option : option.label ?? "")
                    .toLowerCase()
                    .includes(query),
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={copy.fields.interestsLabel}
                  placeholder={copy.fields.interestsPlaceholder}
                  error={showErrorsForStep && Boolean(validation.errors.interests)}
                  helperText={showErrorsForStep ? validation.errors.interests : undefined}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {interestStatus === "loading" ? (
                          <CircularProgress color="inherit" size={16} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {draft.interests.map((id) => {
                const option = interestLookup[id];
                const label = option?.label ?? id;
                return (
                  <Chip
                    key={id}
                    variant="filled"
                    color="primary"
                    label={label}
                    onDelete={() => {
                      markProfileDirty();
                      toggleInterest(id);
                      setPendingInterestIds((prev) =>
                        prev.filter((pendingId) => pendingId !== id),
                      );
                    }}
                  />
                );
              })}
            </Stack>
            {hasPendingInterests && (
              <Typography variant="caption" color="text.secondary">
                {copy.interests.pendingNotice}
              </Typography>
            )}
            {interestStatus === "error" && interestError && (
              <Alert severity="warning">{interestError}</Alert>
            )}
          </Stack>
        );
      case "locations":
        return (
          <Stack spacing={3}>
            <Autocomplete
              multiple
              options={CITY_OPTIONS}
              value={selectedCities}
              onChange={(_, value) => {
                markProfileDirty();
                updateCities(value.map((city) => city.id));
              }}
              getOptionLabel={(option) => `${option.label} · ${option.region}`}
              filterSelectedOptions
              renderTags={() => null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={copy.fields.citiesLabel}
                  placeholder={copy.fields.citiesPlaceholder}
                  error={showErrorsForStep && Boolean(validation.errors.cities)}
                  helperText={showErrorsForStep ? validation.errors.cities : undefined}
                />
              )}
            />
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {selectedCities.map((option, index) => (
                <Chip
                  key={option.id}
                  icon={<LocationOnIcon fontSize="small" />}
                  label={`${option.label}${index === 0 ? copy.locations.primaryTagLabel : ""}`}
                  color={index === 0 ? "primary" : "default"}
                  onDelete={() => {
                    markProfileDirty();
                    updateCities(draft.cities.filter((cityId) => cityId !== option.id));
                  }}
                />
              ))}
            </Stack>
          </Stack>
        );
      default:
        return null;
    }
  };

  const humanizeInterestId = (value: string) =>
    value
      .split("_")
      .map((segment) => (segment ? segment[0].toUpperCase() + segment.slice(1) : ""))
      .join(" ");
  const formatInterestLabel = (id: string) => interestLookup[id]?.label ?? humanizeInterestId(id);

  const buildSocialHref = (
    value: string | undefined,
    platform: "linkedin" | "instagram",
  ): string | null => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    if (trimmed.startsWith("www.")) {
      return `https://${trimmed}`;
    }

    const lower = trimmed.toLowerCase();
    if (platform === "linkedin" && lower.includes("linkedin.com")) {
      return `https://${trimmed}`;
    }

    if (platform === "instagram" && lower.includes("instagram.com")) {
      return `https://${trimmed}`;
    }

    const handle = trimmed.replace(/^@/, "");
    if (!handle) return null;

    return platform === "linkedin"
      ? `https://www.linkedin.com/in/${handle}`
      : `https://instagram.com/${handle}`;
  };

  const getIntroState = (matchId: string) => introStatus[matchId]?.status ?? "idle";

  if (!sessionReady || !hasSession) {
    return null;
  }

  const panelSx = {
    p: { xs: 2.5, sm: 3 },
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 2.5,
  } as const;
  const sectionSx = { display: "flex", flexDirection: "column", gap: 2.5, height: "100%" } as const;

  return (
    <Container component="section" aria-labelledby={titleId} sx={{ pb: 10, pt: { xs: 4, md: 6 } }}>
      <Stack spacing={3.5} sx={{ width: "100%" }}>
        {showSavedToast && (
          <Alert severity="success" sx={{ alignSelf: "flex-start" }}>
            {copy.summary.savedLabel}
          </Alert>
        )}

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Box>
            <Typography variant="h2" id={titleId}>
              {copy.title}
            </Typography>
            {hasSubtitle ? (
              <Typography variant="body1" color="text.secondary">
                {subtitleText}
              </Typography>
            ) : null}
          </Box>
          <Box />
        </Stack>

        <Box sx={panelSx}>
          {isMdUp ? (
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
                <Box sx={sectionSx}>{renderStepContent("bio", showErrorsFor("bio"))}</Box>
                <Box sx={sectionSx}>{renderStepContent("photo", showErrorsFor("photo"))}</Box>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Box sx={{ ...sectionSx, mb: 3 }}>
                  {renderStepContent("interests", showErrorsFor("interests"))}
                </Box>
                <Box sx={{ ...sectionSx, mb: "1cm" }}>
                  {renderStepContent("social", showErrorsFor("social"))}
                </Box>
                <Box sx={sectionSx}>
                  {renderStepContent("locations", showErrorsFor("locations"))}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box sx={sectionSx}>{renderStepContent("bio", showErrorsFor("bio"))}</Box>
              <Box sx={sectionSx}>{renderStepContent("photo", showErrorsFor("photo"))}</Box>
              <Box sx={sectionSx}>
                {renderStepContent("interests", showErrorsFor("interests"))}
              </Box>
              <Box sx={sectionSx}>{renderStepContent("social", showErrorsFor("social"))}</Box>
              <Box sx={sectionSx}>
                {renderStepContent("locations", showErrorsFor("locations"))}
              </Box>
            </Box>
          )}
        </Box>

        <Stack spacing={1.5} alignSelf="flex-start">
          <Button
            variant="contained"
            onClick={handleSaveProfile}
            disabled={status === "saving"}
            sx={{ minWidth: 200 }}
          >
            {status === "saving" ? copy.summary.savingLabel : copy.summary.saveLabel}
          </Button>
          {submitError ? <Alert severity="error">{submitError}</Alert> : null}
        </Stack>

        <Box sx={{ ...panelSx, width: "100%" }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5">{copy.matches.title}</Typography>
              {copy.matches.helper ? (
                <Typography variant="body2" color="text.secondary">
                  {copy.matches.helper}
                </Typography>
              ) : null}
            </Box>
            {reportToast ? <Alert severity="success">{reportToast}</Alert> : null}

            {!canViewMatches ? (
              <Alert severity="info">{copy.matches.lockedMessage}</Alert>
            ) : (
              <>
                {matchesStatus === "loading" && (
                  <Typography variant="body2" color="text.secondary">
                    {copy.matches.loading}
                  </Typography>
                )}
                {matchesStatus === "error" && (
                  <Alert severity="warning">{matchesError ?? copy.matches.error}</Alert>
                )}
                {matchesStatus === "ready" && matchRecommendations.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {copy.matches.empty}
                  </Typography>
                )}
                {matchRecommendations.length > 0 && (
                  <Stack spacing={1.25} divider={<Divider flexItem />}>
                    {matchRecommendations.map((match) => {
                      const state = getIntroState(match.userId);
                      const isLoadingIntro = state === "loading";
                      const matchError =
                        state === "error"
                          ? introStatus[match.userId]?.message || copy.matches.error
                          : undefined;
                      const linkedinHref = buildSocialHref(match.linkedinUrl, "linkedin");
                      const instagramHref = buildSocialHref(match.instagramUrl, "instagram");

                      return (
                        <Stack key={match.userId} spacing={1}>
                          <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                            <Avatar
                              src={match.photoUrl}
                              alt={match.displayName}
                              sx={{ width: 56, height: 56, cursor: "pointer" }}
                              onClick={() => {
                                if (match.photoUrl) {
                                  setEnlargedPhoto({ url: match.photoUrl, name: match.displayName });
                                }
                              }}
                            >
                              {match.displayName.charAt(0)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="subtitle2">{match.displayName}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "normal" }}>
                                {locale === "en" ? "Cities: " : "Ciudades: "}
                                {match.sharedCities.join(", ")}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "normal" }}>
                                {locale === "en" ? "Interests: " : "Intereses: "}
                                {match.sharedInterests.map(formatInterestLabel).join(", ")}
                              </Typography>
                              {match.bio ? (
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                  sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                                >
                                  {match.bio}
                                </Typography>
                              ) : null}
                              {match.linkedinUrl || match.instagramUrl ? (
                                <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                                  {match.linkedinUrl ? (
                                    <Typography variant="body2" color="text.secondary">
                                      LinkedIn:{" "}
                                      {linkedinHref ? (
                                        <Link href={linkedinHref} target="_blank" rel="noopener">
                                          {match.linkedinUrl}
                                        </Link>
                                      ) : (
                                        match.linkedinUrl
                                      )}
                                    </Typography>
                                  ) : null}
                                  {match.instagramUrl ? (
                                    <Typography variant="body2" color="text.secondary">
                                      Instagram:{" "}
                                      {instagramHref ? (
                                        <Link href={instagramHref} target="_blank" rel="noopener">
                                          {match.instagramUrl}
                                        </Link>
                                      ) : (
                                        match.instagramUrl
                                      )}
                                    </Typography>
                                  ) : null}
                                </Stack>
                              ) : null}
                            </Box>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleMatchIntro(match.userId)}
                              disabled={isLoadingIntro}
                              startIcon={<WhatsAppIcon fontSize="small" />}
                            >
                              {isLoadingIntro ? copy.matches.ctaLoading : copy.matches.cta}
                            </Button>
                            <Button
                              size="small"
                              variant="text"
                              color="error"
                              onClick={() => openReportDialog(match)}
                            >
                              {copy.report.ctaLabel}
                            </Button>
                            {matchError && (
                              <Typography variant="caption" color="error">
                                {matchError}
                              </Typography>
                            )}
                          </Stack>
                        </Stack>
                      );
                    })}
                  </Stack>
                )}
              </>
            )}
          </Stack>
        </Box>
      </Stack>
      <Dialog
        open={reportDialogOpen}
        onClose={closeReportDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {reportTarget ? `${copy.report.dialogTitle}: ${reportTarget.displayName}` : copy.report.dialogTitle}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {copy.report.dialogHelper}
            </Typography>
            <TextField
              label={copy.report.reasonLabel}
              placeholder={copy.report.reasonPlaceholder}
              value={reportReason}
              onChange={(event) => setReportReason(event.target.value)}
              multiline
              minRows={3}
              fullWidth
              inputProps={{ maxLength: 600 }}
            />
            {reportError ? <Alert severity="error">{reportError}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReportDialog} disabled={reportStatus === "submitting"}>
            {copy.report.cancelLabel}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReportSubmit}
            disabled={reportStatus === "submitting"}
          >
            {reportStatus === "submitting" ? copy.report.sendingLabel : copy.report.submitLabel}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(enlargedPhoto)}
        onClose={() => setEnlargedPhoto(null)}
        maxWidth="xs"
        fullWidth
      >
        {enlargedPhoto ? (
          <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar
              src={enlargedPhoto.url}
              alt={enlargedPhoto.name}
              sx={{ width: 240, height: 240 }}
            >
              {enlargedPhoto.name.charAt(0)}
            </Avatar>
          </DialogContent>
        ) : null}
      </Dialog>
    </Container>
  );
}
