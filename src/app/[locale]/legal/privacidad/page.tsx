import type { Metadata } from "next";
import { Link, Paper, Stack, Typography } from "@mui/material";

import ContractContent from "@/components/legal/ContractContent";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { buildContractUrl } from "@/constants/consent";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Cómo Pick trata tus datos personales y cuáles son tus derechos.",
};

export default async function PrivacyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale ?? "es";
  const termsHref = buildContractUrl(locale);

  return (
    <LegalPageShell locale={locale} currentSection="privacidad">
      <Stack spacing={3} component="section" aria-labelledby="privacy-heading">
        <Stack spacing={1}>
          <Typography id="privacy-heading" variant="h3" fontWeight={700} letterSpacing="-0.02em">
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
    </LegalPageShell>
  );
}
