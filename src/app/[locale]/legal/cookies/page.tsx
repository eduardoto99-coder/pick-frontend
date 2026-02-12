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
            de terceros para rastreo en esta versión. Si activamos cookies no esenciales, pediremos
            tu autorización previa.
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
              - Almacenamiento local (localStorage): guardamos un identificador de usuario, el
              nombre visible y una marca de perfil completo para mantener tu estado al navegar.
              No se usa para publicidad ni seguimiento externo.
            </Typography>
            <Typography variant="body1">
              - sessionStorage: se usa temporalmente para guardar el correo y datos mínimos durante
              la confirmación de registro.
            </Typography>
            <Typography variant="body1">
              - Cookies no esenciales: si activamos analítica o medición opcional, lo haremos con
              tu autorización previa y podrás cambiar preferencias.
            </Typography>
            <Typography variant="body1">
              - Cómo controlar: puedes borrar cookies y almacenamiento local en tu navegador;
              eliminarlos puede cerrar tu sesión o borrar datos locales. Añadiremos controles
              adicionales cuando activemos analítica opcional.
            </Typography>
            <Typography variant="body1">
              - Si una cookie permite identificarte, su tratamiento se rige por nuestro aviso de
              privacidad y el contrato de servicio.
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
