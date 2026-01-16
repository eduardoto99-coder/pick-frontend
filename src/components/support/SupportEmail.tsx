import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Button, Card, CardContent, Link, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { defaultLocale, isLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/types";

type SupportEmailProps = {
  locale?: string;
  variant?: "card" | "inline";
  sx?: SxProps<Theme>;
};

const mailtoHref = "mailto:help@pickglobal.com?subject=Pick%20support";

export default function SupportEmail({
  locale = "es",
  variant = "card",
  sx,
}: SupportEmailProps) {
  const resolvedLocale = isLocale(locale) ? (locale as Locale) : defaultLocale;
  const copy: Record<
    Locale,
    {
      title: string;
      description: string;
      cta: string;
      inlineLabel: string;
      email: string;
    }
  > = {
    es: {
      title: "¿Necesitas ayuda?",
      description: "Escríbenos y respondemos en menos de un día hábil.",
      cta: "Enviar correo",
      inlineLabel: "¿Necesitas ayuda? Escríbenos a",
      email: "help@pickglobal.com",
    },
    en: {
      title: "Need help?",
      description: "Email us and we'll get back within one business day.",
      cta: "Email support",
      inlineLabel: "Need help? Email",
      email: "help@pickglobal.com",
    },
  };
  const labels = copy[resolvedLocale];
  const extraSx = Array.isArray(sx) ? sx : sx ? [sx] : [];
  const inlineSx = [{ width: "100%" }, ...extraSx] as SxProps<Theme>;
  const cardSx = [
    {
      width: "100%",
      border: "1px solid",
      borderColor: "divider",
      boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
    },
    ...extraSx,
  ] as SxProps<Theme>;

  if (variant === "inline") {
    return (
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        alignItems="center"
        sx={inlineSx}
      >
        <Typography variant="body2" color="inherit">
          {labels.inlineLabel}
        </Typography>
        <Link href={mailtoHref} color="inherit" underline="always">
          {labels.email}
        </Link>
      </Stack>
    );
  }

  return (
    <Card
      sx={cardSx}
    >
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" component="p">
              {labels.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {labels.description}
            </Typography>
          </Stack>
          <Button
            component="a"
            href={mailtoHref}
            variant="contained"
            startIcon={<MailOutlineIcon />}
            sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
          >
            {labels.cta}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
