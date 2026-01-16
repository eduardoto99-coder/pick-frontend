import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Box, Container, Divider, IconButton, Link, Stack, Typography } from "@mui/material";
import { defaultLocale, isLocale } from "@/i18n/config";
import SupportEmail from "@/components/support/SupportEmail";
import type { Locale } from "@/i18n/types";

type LandingFooterProps = {
  locale?: string;
};

export default function LandingFooter({ locale = "es" }: LandingFooterProps) {
  const year = new Date().getFullYear();
  const resolvedLocale = isLocale(locale) ? (locale as Locale) : defaultLocale;
  const localePrefix = `/${resolvedLocale}`;
  const copy: Record<
    Locale,
    {
      rights: string;
      privacy: string;
      terms: string;
      cookies: string;
      legalNavLabel: string;
      instagramAria: string;
      linkedinAria: string;
    }
  > = {
    es: {
      rights: "Todos los derechos reservados.",
      privacy: "Privacidad",
      terms: "Términos",
      cookies: "Cookies",
      legalNavLabel: "Enlaces legales",
      instagramAria: "Instagram de Pick",
      linkedinAria: "LinkedIn de Pick",
    },
    en: {
      rights: "All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies",
      legalNavLabel: "Legal links",
      instagramAria: "Pick on Instagram",
      linkedinAria: "Pick on LinkedIn",
    },
  };
  const labels = copy[resolvedLocale];

  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 8, md: 10 },
        borderTop: "1px solid rgba(11, 35, 51, 0.12)",
        backgroundColor: "#0B2333",
        color: "#F5F2EB",
      }}
    >
      <Container sx={{ py: { xs: 4, md: 5 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 4 }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Stack spacing={1.5}>
            <SupportEmail locale={resolvedLocale} variant="inline" />
            <Typography variant="subtitle1" sx={{ letterSpacing: "-0.02em" }}>
              © {year} Pick. {labels.rights}
            </Typography>
            <Stack
              component="nav"
              aria-label={labels.legalNavLabel}
              direction="row"
              spacing={2}
              alignItems="center"
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
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              component="a"
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label={labels.instagramAria}
              sx={{ color: "#F5F2EB", border: "1px solid rgba(245, 242, 235, 0.36)" }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label={labels.linkedinAria}
              sx={{ color: "#F5F2EB", border: "1px solid rgba(245, 242, 235, 0.36)" }}
            >
              <LinkedInIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
