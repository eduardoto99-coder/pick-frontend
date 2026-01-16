"use client";

import { useCallback, useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  MenuItem,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SupportEmail from "@/components/support/SupportEmail";
import {
  fetchMatchDashboard,
  requestMatchIntro,
  type MatchIntroResponse,
  type MatchRecommendation,
} from "@/services/matchmaking-service";
import { fetchInterests } from "@/services/interest-service";
import { getMatchesCopy } from "./matches-copy";
import { isProfileMarkedComplete } from "@/utils/local-user";
import {
  fetchFeedbackEligibility,
  submitFeedback,
  type FeedbackEligibilityResponse,
} from "@/services/feedback-service";
import type { FeedbackOutcome } from "./matches-copy";

type MatchesDashboardProps = {
  locale?: string;
};

type ActionState = {
  status: "idle" | "loading" | "error";
  message?: string;
};

const MATCH_LIMIT = 8;

export default function MatchesDashboard({ locale }: MatchesDashboardProps) {
  const copy = getMatchesCopy(locale);
  const titleId = "matches-dashboard-title";
  const descriptionId = "matches-dashboard-description";
  const [profileComplete, setProfileComplete] = useState<boolean>(() =>
    typeof window !== "undefined" ? isProfileMarkedComplete() : false,
  );
  const [matches, setMatches] = useState<MatchRecommendation[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState<string>();
  const [lastUpdated, setLastUpdated] = useState<string>();
  const [introStatus, setIntroStatus] = useState<Record<string, ActionState>>({});
  const [previewStatus, setPreviewStatus] = useState<Record<string, ActionState>>({});
  const [copyStatus, setCopyStatus] = useState<Record<string, "idle" | "copied" | "error">>({});
  const [feedbackEligibility, setFeedbackEligibility] = useState<FeedbackEligibilityResponse | null>(
    null,
  );
  const [feedbackStatus, setFeedbackStatus] = useState<
    "idle" | "loading" | "ready" | "submitting" | "submitted" | "error"
  >("idle");
  const [feedbackError, setFeedbackError] = useState<string>();
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackOutcome, setFeedbackOutcome] = useState<FeedbackOutcome | "">("");
  const [feedbackMatchCode, setFeedbackMatchCode] = useState<string>("");
  const [feedbackComment, setFeedbackComment] = useState<string>("");
  const [interestLookup, setInterestLookup] = useState<Record<string, string>>({});

  const loadMatches = useCallback(async () => {
    if (!profileComplete) {
      setStatus("idle");
      setMatches([]);
      return;
    }
    try {
      setStatus("loading");
      const data = await fetchMatchDashboard(MATCH_LIMIT);
      setMatches(data);
      setError(undefined);
      setStatus("ready");
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.status.error);
      setMatches([]);
      setStatus("error");
    }
  }, [copy.status.error, profileComplete]);

  const loadFeedbackEligibility = useCallback(async () => {
    if (!profileComplete) {
      setFeedbackEligibility(null);
      setFeedbackStatus("idle");
      return;
    }
    try {
      setFeedbackStatus("loading");
      const eligibility = await fetchFeedbackEligibility();
      setFeedbackEligibility(eligibility);
      setFeedbackError(undefined);
      setFeedbackStatus("ready");
    } catch (err) {
      setFeedbackEligibility(null);
      setFeedbackStatus("error");
      setFeedbackError(err instanceof Error ? err.message : copy.feedback.error);
    }
  }, [copy.feedback.error, profileComplete]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const syncProfile = () => setProfileComplete(isProfileMarkedComplete());
      window.addEventListener("storage", syncProfile);
      return () => window.removeEventListener("storage", syncProfile);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (!profileComplete) {
      setMatches([]);
      setStatus("idle");
      return;
    }
    loadMatches();
  }, [loadMatches, profileComplete]);

  useEffect(() => {
    if (!profileComplete) {
      setFeedbackEligibility(null);
      setFeedbackStatus("idle");
      return;
    }
    loadFeedbackEligibility();
  }, [loadFeedbackEligibility, profileComplete]);

  useEffect(() => {
    let isMounted = true;
    fetchInterests("")
      .then((options) => {
        if (!isMounted) return;
        const lookup = options.reduce<Record<string, string>>((acc, option) => {
          if (option?.id) {
            acc[option.id] = option.label ?? option.id;
          }
          return acc;
        }, {});
        setInterestLookup(lookup);
      })
      .catch(() => {
        if (!isMounted) return;
        setInterestLookup({});
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!profileComplete) {
    const profileHref = `/${locale ?? "es"}/profile`;
    return (
      <Container
        component="section"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        sx={{ pb: 8 }}
      >
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography variant="h2" id={titleId}>
            {copy.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" id={descriptionId}>
            {copy.subtitle}
          </Typography>
        </Stack>
        <Alert severity="info" sx={{ mb: 3 }}>
          {copy.incompleteProfileMessage}
        </Alert>
        <Button variant="contained" href={profileHref}>
          {copy.incompleteCta}
        </Button>
        <SupportEmail locale={locale} sx={{ mt: 3 }} />
      </Container>
    );
  }

  const handleCopyIntro = async (match: MatchRecommendation) => {
    if (!match.introPreview?.message) {
      return;
    }
    try {
      await navigator.clipboard.writeText(match.introPreview.message);
      setCopyStatus((prev) => ({ ...prev, [match.userId]: "copied" }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [match.userId]: "idle" }));
      }, 2000);
    } catch {
      setCopyStatus((prev) => ({ ...prev, [match.userId]: "error" }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [match.userId]: "idle" }));
      }, 2000);
    }
  };

  const updateMatchPreview = (matchId: string, response: MatchIntroResponse) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.userId === matchId
          ? {
              ...match,
              introPreview: {
                matchCode: response.matchCode,
                message: response.message,
                whatsappUrl: response.whatsappUrl,
                sponsor: response.sponsor,
                sharedCities: response.sharedCities,
                sharedInterests: response.sharedInterests,
              },
            }
          : match,
      ),
    );
  };

  const handleIntroAction = async (matchId: string, openWhatsApp: boolean) => {
    setIntroStatus((prev) => ({ ...prev, [matchId]: { status: "loading" } }));
    const match = matches.find((item) => item.userId === matchId);
    try {
      const response = await requestMatchIntro(matchId, match?.introPreview?.matchCode);
      updateMatchPreview(matchId, response);
      setIntroStatus((prev) => ({ ...prev, [matchId]: { status: "idle" } }));
      if (openWhatsApp && typeof window !== "undefined") {
        window.open(response.whatsappUrl, "_blank", "noopener");
      }
    } catch (err) {
      setIntroStatus((prev) => ({
        ...prev,
        [matchId]: {
          status: "error",
          message: err instanceof Error ? err.message : copy.status.error,
        },
      }));
    }
  };

  const handleRefreshPreview = async (matchId: string) => {
    setPreviewStatus((prev) => ({ ...prev, [matchId]: { status: "loading" } }));
    try {
      const response = await requestMatchIntro(matchId);
      updateMatchPreview(matchId, response);
      setPreviewStatus((prev) => ({ ...prev, [matchId]: { status: "idle" } }));
    } catch (err) {
      setPreviewStatus((prev) => ({
        ...prev,
        [matchId]: {
          status: "error",
          message: err instanceof Error ? err.message : copy.status.error,
        },
      }));
    }
  };

  const handleDismissFeedback = () => {
    setFeedbackEligibility((prev) => (prev ? { ...prev, shouldPrompt: false } : prev));
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackEligibility?.milestoneId) {
      setFeedbackError(copy.feedback.error);
      setFeedbackStatus("error");
      return;
    }
    if (!feedbackRating || !feedbackOutcome) {
      setFeedbackError(copy.feedback.error);
      setFeedbackStatus("error");
      return;
    }
    try {
      setFeedbackStatus("submitting");
      await submitFeedback({
        aiMessageQuality: feedbackRating,
        outcome: feedbackOutcome,
        matchCode: feedbackMatchCode.trim() || undefined,
        comment: feedbackComment.trim() || undefined,
      });
      setFeedbackStatus("submitted");
      setFeedbackEligibility((prev) => (prev ? { ...prev, shouldPrompt: false } : prev));
      setFeedbackError(undefined);
    } catch (err) {
      setFeedbackStatus("error");
      setFeedbackError(err instanceof Error ? err.message : copy.feedback.error);
    }
  };

  const renderFeedbackPrompt = () => {
    if (feedbackStatus === "submitted") {
      return <Alert severity="success">{copy.feedback.submitted}</Alert>;
    }
    if (feedbackStatus === "error" && feedbackError && feedbackEligibility?.shouldPrompt !== true) {
      return <Alert severity="error">{feedbackError}</Alert>;
    }
    if (!feedbackEligibility?.shouldPrompt) {
      return null;
    }

    const milestoneLabel = feedbackEligibility.milestoneId
      ? `${copy.feedback.milestonePrefix}: ${copy.feedback.milestoneLabels[feedbackEligibility.milestoneId]}`
      : undefined;

    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="flex-start">
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{copy.feedback.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {copy.feedback.description}
                </Typography>
              </Box>
              {milestoneLabel && <Chip label={milestoneLabel} size="small" />}
            </Stack>
            <Box>
              <Typography variant="subtitle2">{copy.feedback.ratingLabel}</Typography>
              <Rating
                name="ai-message-quality"
                value={feedbackRating}
                onChange={(_, value) => setFeedbackRating(value)}
                max={5}
                precision={1}
              />
              <Typography variant="caption" color="text.secondary">
                {copy.feedback.ratingHelper}
              </Typography>
            </Box>
            <TextField
              select
              fullWidth
              label={copy.feedback.outcomeLabel}
              value={feedbackOutcome}
              onChange={(event) => setFeedbackOutcome(event.target.value as FeedbackOutcome)}
            >
              {Object.entries(copy.feedback.outcomeOptions).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label={copy.feedback.matchCodeLabel}
              value={feedbackMatchCode}
              onChange={(event) => setFeedbackMatchCode(event.target.value)}
            />
            <TextField
              fullWidth
              label={copy.feedback.commentLabel}
              value={feedbackComment}
              onChange={(event) => setFeedbackComment(event.target.value)}
              multiline
              minRows={2}
            />
            {feedbackStatus === "error" && feedbackError && (
              <Alert severity="error">{feedbackError}</Alert>
            )}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="contained"
                onClick={handleSubmitFeedback}
                disabled={feedbackStatus === "submitting"}
              >
                {feedbackStatus === "submitting" ? copy.feedback.submitLoading : copy.feedback.submitCta}
              </Button>
              <Button variant="text" onClick={handleDismissFeedback}>
                {copy.feedback.skipCta}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  const formatUpdatedLabel = () => {
    if (!lastUpdated) {
      return "";
    }
    const timestamp = new Date(lastUpdated);
    return `${copy.status.updatedPrefix}: ${timestamp.toLocaleString(locale ?? undefined)}`;
  };

  const renderMatchCard = (match: MatchRecommendation) => {
    const introState = introStatus[match.userId]?.status ?? "idle";
    const introError = introStatus[match.userId]?.message;
    const refreshState = previewStatus[match.userId]?.status ?? "idle";
    const refreshError = previewStatus[match.userId]?.message;
    const copyState = copyStatus[match.userId] ?? "idle";
    const humanizeInterestId = (value: string) =>
      value
        .split("_")
        .map((segment) => (segment ? segment[0].toUpperCase() + segment.slice(1) : ""))
        .join(" ");
    const formatInterestLabel = (id: string) => interestLookup[id] ?? humanizeInterestId(id);

    return (
      <Card key={match.userId}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={match.photoUrl} alt={match.displayName} sx={{ width: 56, height: 56 }}>
                {match.displayName.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{match.displayName}</Typography>
                {match.bio && (
                <Typography variant="body2" color="text.secondary">
                  {match.bio}
                </Typography>
              )}
            </Box>
            {match.introPreview?.matchCode && (
              <Chip
                label={`${copy.card.matchCodeLabel}: ${match.introPreview.matchCode}`}
                size="small"
                color="default"
              />
            )}
            <Chip
              label={copy.compatibilityLabels[match.compatibility]}
              color={
                match.compatibility === "perfect"
                  ? "success"
                    : match.compatibility === "strong"
                      ? "warning"
                      : "default"
                }
              />
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {copy.card.sharedCitiesLabel}
                </Typography>
                <Typography>{match.sharedCities.join(", ")}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {copy.card.sharedInterestsLabel}
                </Typography>
                <Typography>{match.sharedInterests.map(formatInterestLabel).join(", ")}</Typography>
              </Box>
            </Stack>
            {match.introPreview ? (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "background.default",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {copy.card.previewLabel}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {match.introPreview.message}
                </Typography>
                {match.introPreview.sponsor && (
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <Chip label={copy.card.sponsorBadge} size="small" color="primary" variant="outlined" />
                    <Typography variant="caption" color="text.secondary">
                      {match.introPreview.sponsor.tagline
                        ? `${match.introPreview.sponsor.name}: ${match.introPreview.sponsor.tagline}`
                        : match.introPreview.sponsor.name}
                    </Typography>
                  </Stack>
                )}
              </Box>
            ) : (
              <Alert severity="info">{copy.card.noPreview}</Alert>
            )}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={() => handleCopyIntro(match)}
                disabled={!match.introPreview}
              >
                {copyState === "copied"
                  ? copy.actions.copySuccess
                  : copyState === "error"
                    ? copy.actions.copyError
                    : copy.actions.copy}
              </Button>
              <Button
                variant="text"
                startIcon={<RefreshIcon />}
                onClick={() => handleRefreshPreview(match.userId)}
                disabled={refreshState === "loading"}
              >
                {refreshState === "loading" ? copy.actions.refreshingPreview : copy.actions.refreshPreview}
              </Button>
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon />}
                onClick={() => handleIntroAction(match.userId, true)}
                disabled={introState === "loading"}
              >
                {introState === "loading" ? copy.actions.openLoading : copy.actions.open}
              </Button>
            </Stack>
            {(introError || refreshError) && (
              <Typography variant="caption" color="error">
                {introError ?? refreshError}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container
      component="section"
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-busy={status === "loading"}
      sx={{ pb: 8 }}
    >
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Typography variant="h2" id={titleId}>
          {copy.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" id={descriptionId}>
          {copy.subtitle}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="flex-start">
          <Button variant="contained" startIcon={<RefreshIcon />} onClick={loadMatches} disabled={status === "loading"}>
            {copy.refreshCta}
          </Button>
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary" aria-live="polite">
              {formatUpdatedLabel()}
            </Typography>
          )}
        </Stack>
      </Stack>

      <SupportEmail locale={locale} sx={{ mb: 3 }} />

      {renderFeedbackPrompt()}

      {status === "loading" && (
        <Typography variant="body1" color="text.secondary" aria-live="polite">
          {copy.status.loading}
        </Typography>
      )}
      {status === "error" && <Alert severity="error">{error ?? copy.status.error}</Alert>}
      {status === "ready" && matches.length === 0 && (
        <Typography variant="body1" color="text.secondary" aria-live="polite">
          {copy.status.empty}
        </Typography>
      )}
      {matches.length > 0 && (
        <Stack spacing={2}>
          {matches.map((match) => renderMatchCard(match))}
        </Stack>
      )}
    </Container>
  );
}
