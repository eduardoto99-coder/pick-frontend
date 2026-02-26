import InstagramIcon from "@mui/icons-material/Instagram";
import { Box, Container, Divider, IconButton, Link, Stack, Typography } from "@mui/material";
import { defaultLocale, isLocale } from "@/i18n/config";
import SupportEmail from "@/components/support/SupportEmail";
import PickMark from "@/components/branding/PickMark";
import type { Locale } from "@/i18n/types";

type LandingFooterProps = {
  locale?: string;
  disableTopMargin?: boolean;
};

export default function LandingFooter({
  locale = "es",
  disableTopMargin = false,
}: LandingFooterProps) {
  const year = new Date().getFullYear();
  const resolvedLocale = isLocale(locale) ? (locale as Locale) : defaultLocale;
  const localePrefix = `/${resolvedLocale}`;
  const copy: Record<
    Locale,
    {
      rights: string;
      primaryNavLabel: string;
      mainLinksLabel: string;
      privacy: string;
      terms: string;
      cookies: string;
      legalNavLabel: string;
      instagramAria: string;
      home: string;
      howItWorks: string;
      scenarios: string;
      safety: string;
      audience: string;
      signIn: string;
    }
  > = {
    es: {
      rights: "Todos los derechos reservados.",
      primaryNavLabel: "Navegación principal",
      mainLinksLabel: "Explorar Pick",
      privacy: "Privacidad",
      terms: "Términos",
      cookies: "Cookies",
      legalNavLabel: "Enlaces legales",
      instagramAria: "Instagram de Pick",
      home: "Inicio",
      howItWorks: "Cómo funciona",
      scenarios: "Escenarios",
      safety: "Seguridad",
      audience: "Para quién es",
      signIn: "Entrar",
    },
    en: {
      rights: "All rights reserved.",
      primaryNavLabel: "Main navigation",
      mainLinksLabel: "Explore Pick",
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies",
      legalNavLabel: "Legal links",
      instagramAria: "Pick on Instagram",
      home: "Home",
      howItWorks: "How it works",
      scenarios: "Scenarios",
      safety: "Safety",
      audience: "Who it is for",
      signIn: "Sign in",
    },
  };
  const labels = copy[resolvedLocale];
  const homeSectionId = resolvedLocale === "es" ? "inicio" : "home";
  const safetySectionId = resolvedLocale === "es" ? "seguridad" : "safety";
  const audienceSectionId = resolvedLocale === "es" ? "destacados" : "highlights";

  return (
    <Box
      component="footer"
      sx={{
        mt: disableTopMargin ? 0 : { xs: 8, md: 10 },
        borderTop: "1px solid rgba(11, 35, 51, 0.12)",
        backgroundColor: "#0B2333",
        color: "#F5F2EB",
      }}
    >
      <Container sx={{ py: { xs: 4, md: 5 } }}>
        <Stack spacing={4}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 3, md: 4 }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Link
              href={localePrefix}
              underline="none"
              color="inherit"
              aria-label="Pick home"
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PickMark size={36} />
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "var(--font-sora)",
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                    fontSize: "1.85rem",
                    color: "inherit",
                  }}
                >
                  Pick
                </Typography>
              </Stack>
            </Link>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton
                component="a"
                href="https://www.instagram.com/pick.global"
                target="_blank"
                rel="noreferrer"
                aria-label={labels.instagramAria}
                sx={{ color: "#F5F2EB", border: "1px solid rgba(245, 242, 235, 0.36)" }}
              >
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={{ xs: 3, lg: 6 }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", lg: "center" }}
          >
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" sx={{ color: "rgba(245, 242, 235, 0.72)" }}>
                {labels.mainLinksLabel}
              </Typography>
              <Stack
                component="nav"
                aria-label={labels.primaryNavLabel}
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >
                <Link href={`${localePrefix}#${homeSectionId}`} color="inherit" underline="hover">
                  {labels.home}
                </Link>
                <Link href={`${localePrefix}#journey`} color="inherit" underline="hover">
                  {labels.howItWorks}
                </Link>
                <Link href={`${localePrefix}#social-proof`} color="inherit" underline="hover">
                  {labels.scenarios}
                </Link>
                <Link href={`${localePrefix}#${safetySectionId}`} color="inherit" underline="hover">
                  {labels.safety}
                </Link>
                <Link href={`${localePrefix}#${audienceSectionId}`} color="inherit" underline="hover">
                  {labels.audience}
                </Link>
                <Link href={`${localePrefix}/auth/sign-in`} color="inherit" underline="hover">
                  {labels.signIn}
                </Link>
              </Stack>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2" sx={{ color: "rgba(245, 242, 235, 0.72)" }}>
                {labels.legalNavLabel}
              </Typography>
              <Stack
                component="nav"
                aria-label={labels.legalNavLabel}
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >
                <Link href={`${localePrefix}/legal/privacidad`} color="inherit" underline="hover">
                  {labels.privacy}
                </Link>
                <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(245, 242, 235, 0.36)" }} />
                <Link href={`${localePrefix}/legal/terminos`} color="inherit" underline="hover">
                  {labels.terms}
                </Link>
                <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(245, 242, 235, 0.36)" }} />
                <Link href={`${localePrefix}/legal/cookies`} color="inherit" underline="hover">
                  {labels.cookies}
                </Link>
              </Stack>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: "rgba(245, 242, 235, 0.16)" }} />

          <Stack spacing={1.5}>
            <SupportEmail locale={resolvedLocale} variant="inline" />
            <Typography variant="subtitle1" sx={{ letterSpacing: "-0.02em" }}>
              © {year} Pick. {labels.rights}
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
