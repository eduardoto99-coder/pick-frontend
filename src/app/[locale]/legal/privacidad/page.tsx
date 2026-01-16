import type { Metadata } from "next";
import { Container, Link, Paper, Stack, Typography } from "@mui/material";

import ContractContent from "@/components/legal/ContractContent";
import { buildContractUrl } from "@/constants/consent";

type PageProps = {
  params: {
    locale: string;
  };
};

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Cómo Pick trata tus datos personales y cuáles son tus derechos.",
};

export default function PrivacyPage({ params }: PageProps) {
  const locale = params.locale ?? "es";
  const termsHref = buildContractUrl(locale);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }} component="main" id="main-content">
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h3" fontWeight={700} letterSpacing="-0.02em">
            Aviso de privacidad
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
          <ContractContent compact />
        </Paper>

        <Typography variant="body2" color="text.secondary">
          También puedes leer el contrato completo en <Link href={termsHref}>este enlace</Link>.
        </Typography>
      </Stack>
    </Container>
  );
}
