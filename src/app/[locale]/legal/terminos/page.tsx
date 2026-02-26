import type { Metadata } from "next";
import { Link, Paper, Stack, Typography } from "@mui/material";

import ContractContent from "@/components/legal/ContractContent";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { ACTIVE_TERMS_VERSION, buildPrivacyUrl } from "@/constants/consent";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const metadata: Metadata = {
  title: "Contrato de servicio y privacidad",
  description:
    "Términos y aviso de privacidad que rigen el uso de Pick y el tratamiento de datos personales.",
};

export default async function TermsAndPrivacyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale ?? "es";
  const privacyHref = buildPrivacyUrl(locale);

  return (
    <LegalPageShell locale={locale} currentSection="terminos">
      <Stack spacing={3} component="section" aria-labelledby="terms-heading">
        <Stack spacing={1}>
          <Typography id="terms-heading" variant="h3" fontWeight={700} letterSpacing="-0.02em">
            Contrato de servicio y privacidad
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Revisa la versión vigente ({ACTIVE_TERMS_VERSION}) y acepta antes de crear tu cuenta. Este
            documento cubre nuestras obligaciones bajo Habeas Data y el tratamiento de datos con
            AWS, MongoDB Atlas, inteligencia artificial y WhatsApp.
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
          <ContractContent />
        </Paper>

        <Typography variant="body2" color="text.secondary">
          ¿Solo quieres leer el aviso de privacidad? <Link href={privacyHref}>Encuéntralo aquí</Link>.
        </Typography>
      </Stack>
    </LegalPageShell>
  );
}
