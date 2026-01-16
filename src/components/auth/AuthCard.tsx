import Link from "next/link";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";

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
    <Container
      maxWidth="sm"
      sx={{
        py: { xs: 6, md: 10 },
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Stack spacing={3} width="100%">
        <Link href={homeHref} style={{ textDecoration: "none" }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "var(--font-sora)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              color: "primary.main",
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Pick
          </Typography>
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
  );
}
