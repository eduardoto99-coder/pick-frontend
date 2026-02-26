import Link from "next/link";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import PickMark from "@/components/branding/PickMark";
import LandingFooter from "@/components/navigation/LandingFooter";

export type AuthCardProps = {
  locale?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthCard({
  locale = "es",
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  const homeHref = `/${locale}`;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Container
        maxWidth="sm"
        sx={{
          py: { xs: 6, md: 10 },
          flex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Stack spacing={3} width="100%">
          <Link href={homeHref} style={{ textDecoration: "none" }}>
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              justifyContent={{ xs: "center", sm: "flex-start" }}
              sx={{ color: "primary.main" }}
            >
              <PickMark size={39} />
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "var(--font-sora)",
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  fontSize: "1.95rem",
                  color: "inherit",
                }}
              >
                Pick
              </Typography>
            </Stack>
          </Link>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 12px 40px rgba(15, 23, 42, 0.1)",
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Typography component="h1" variant="h5" fontWeight={600} gutterBottom>
                  {title}
                </Typography>
                {subtitle ? (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                ) : null}
              </Box>
              {children}
              {footer ? <Box>{footer}</Box> : null}
            </Stack>
          </Paper>
        </Stack>
      </Container>
      <LandingFooter locale={locale} disableTopMargin />
    </Box>
  );
}
