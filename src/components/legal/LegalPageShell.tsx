import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { defaultLocale, isLocale } from "@/i18n/config";
import LandingFooter from "@/components/navigation/LandingFooter";
import LandingHeader from "@/components/navigation/LandingHeader";
import type { Locale } from "@/i18n/types";

type LegalSection = "privacidad" | "terminos" | "cookies";

type LegalPageShellProps = {
  children: React.ReactNode;
  currentSection: LegalSection;
  locale?: string;
};

export default function LegalPageShell({
  children,
  currentSection,
  locale = "es",
}: LegalPageShellProps) {
  const resolvedLocale = isLocale(locale) ? (locale as Locale) : defaultLocale;
  const localePrefix = `/${resolvedLocale}`;
  const copy: Record<
    Locale,
    {
      legalHubTitle: string;
      legalHubDescription: string;
      legalNavLabel: string;
      privacy: string;
      terms: string;
      cookies: string;
      backToHome: string;
      backToFlow: string;
    }
  > = {
    es: {
      legalHubTitle: "Centro legal de Pick",
      legalHubDescription:
        "Consulta privacidad, términos y cookies. Cuando termines, vuelve al flujo principal para crear perfil o iniciar sesión.",
      legalNavLabel: "Navegación de documentos legales",
      privacy: "Privacidad",
      terms: "Términos",
      cookies: "Cookies",
      backToHome: "Volver al inicio",
      backToFlow: "Volver al flujo principal",
    },
    en: {
      legalHubTitle: "Pick legal center",
      legalHubDescription:
        "Review privacy, terms, and cookies. When done, return to the main flow to create a profile or sign in.",
      legalNavLabel: "Legal documents navigation",
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies",
      backToHome: "Back to home",
      backToFlow: "Back to main flow",
    },
  };
  const labels = copy[resolvedLocale];
  const legalLinks = [
    { id: "privacidad" as const, href: `${localePrefix}/legal/privacidad`, label: labels.privacy },
    { id: "terminos" as const, href: `${localePrefix}/legal/terminos`, label: labels.terms },
    { id: "cookies" as const, href: `${localePrefix}/legal/cookies`, label: labels.cookies },
  ];

  return (
    <>
      <LandingHeader locale={resolvedLocale} />
      <Box component="main" id="main-content" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Stack spacing={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "#F7FAFA",
              }}
            >
              <Stack spacing={2.5}>
                <Stack spacing={1}>
                  <Typography variant="h5" fontWeight={700}>
                    {labels.legalHubTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {labels.legalHubDescription}
                  </Typography>
                </Stack>

                <Stack
                  component="nav"
                  aria-label={labels.legalNavLabel}
                  direction="row"
                  spacing={1.25}
                  flexWrap="wrap"
                  useFlexGap
                >
                  {legalLinks.map((item) => (
                    <Button
                      key={item.id}
                      href={item.href}
                      size="small"
                      variant={currentSection === item.id ? "contained" : "outlined"}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    component="a"
                    href={localePrefix}
                    variant="text"
                    startIcon={<HomeRoundedIcon />}
                  >
                    {labels.backToHome}
                  </Button>
                  <Button
                    component="a"
                    href={`${localePrefix}/auth/sign-up`}
                    variant="contained"
                    startIcon={<ArrowBackRoundedIcon />}
                  >
                    {labels.backToFlow}
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            {children}
          </Stack>
        </Container>
      </Box>
      <LandingFooter locale={resolvedLocale} />
    </>
  );
}
