"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useAccountLinks } from "@/hooks/use-account-links";
import { defaultLocale, isLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/types";

type LandingHeaderProps = {
  locale?: string;
};

export default function LandingHeader({ locale = "es" }: LandingHeaderProps) {
  const router = useRouter();
  const resolvedLocale = isLocale(locale) ? (locale as Locale) : defaultLocale;
  const copy: Record<
    Locale,
    {
      signIn: string;
      account: string;
      languageLabel: string;
      switchAria: string;
      navLabel: string;
      homeAria: string;
      signOut: string;
    }
  > = {
    es: {
      signIn: "Inicia sesión o regístrate",
      account: "Mi cuenta",
      signOut: "Cerrar sesión",
      languageLabel: "English",
      switchAria: "Cambiar a inglés",
      navLabel: "Navegación principal",
      homeAria: "Ir al inicio de Pick",
    },
    en: {
      signIn: "Sign in or join",
      account: "My account",
      signOut: "Sign out",
      languageLabel: "Español",
      switchAria: "Switch to Spanish",
      navLabel: "Main navigation",
      homeAria: "Go to Pick home",
    },
  };
  const { signInHref, accountHref, ready, hasSession, signOut } = useAccountLinks(resolvedLocale);
  const pathname = usePathname();
  const landingHref = `/${resolvedLocale}`;
  const labels = copy[resolvedLocale];
  const isAccountView = Boolean(pathname?.startsWith(accountHref));

  const handleSignOut = () => {
    signOut();
    router.replace(signInHref);
  };

  return (
    <Box
      component="header"
      sx={{
        py: { xs: 3, md: 4 },
      }}
    >
      <Container>
        <Box
          component="nav"
          aria-label={labels.navLabel}
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Link
            href={landingHref}
            aria-label={labels.homeAria}
            style={{ textDecoration: "none" }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: "var(--font-sora)",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                color: "primary.main",
              }}
            >
              Pick
            </Typography>
          </Link>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {/* TODO: restore locale switcher when Turbopack locale routing is stable */}
            {(!ready || !hasSession) && (
              <Button
                component={Link}
                href={signInHref}
                variant="contained"
                size="small"
                sx={{ borderRadius: 999, width: { xs: "100%", sm: "auto" } }}
              >
                {labels.signIn}
              </Button>
            )}
            {ready && hasSession && !isAccountView && (
              <Button
                component={Link}
                href={accountHref}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 999, width: { xs: "100%", sm: "auto" } }}
                startIcon={<AccountCircleRoundedIcon fontSize="small" />}
              >
                {labels.account}
              </Button>
            )}
            {ready && hasSession && isAccountView && (
              <Button
                variant="outlined"
                size="small"
                sx={{ borderRadius: 999, width: { xs: "100%", sm: "auto" } }}
                onClick={handleSignOut}
                startIcon={<LogoutRoundedIcon fontSize="small" />}
              >
                {labels.signOut}
              </Button>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
