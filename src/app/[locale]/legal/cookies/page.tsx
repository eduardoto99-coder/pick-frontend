import type { Metadata } from "next";
import { Container, Paper, Stack, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Uso de cookies y almacenamiento local en Pick.",
};

export default function CookiesPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }} component="main" id="main-content">
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h3" fontWeight={700} letterSpacing="-0.02em">
            Política de cookies
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Usamos cookies esenciales para seguridad y sesión. No usamos cookies de publicidad ni
            de terceros para rastreo en esta versión.
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 12px 40px rgba(15, 23, 42, 0.08)",
          }}
        >
          <Stack spacing={2}>
            <Typography variant="body1">
              - Cookies necesarias: autenticación de sesión y seguridad básica para prevenir abuso.
            </Typography>
            <Typography variant="body1">
              - Almacenamiento local: se usa únicamente para preferencias de idioma y estado de
              sesión local durante el stub de autenticación.
            </Typography>
            <Typography variant="body1">
              - Cómo controlar: puedes borrar cookies en tu navegador; eliminarlas puede cerrar tu
              sesión. Añadiremos controles adicionales cuando activemos analítica opcional.
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
