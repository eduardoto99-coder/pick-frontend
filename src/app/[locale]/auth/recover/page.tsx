import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import PasswordRecoveryForm from "@/components/auth/PasswordRecoveryForm";

type PageProps = {
  params: {
    locale: string;
  };
};

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description: "Solicita un reinicio de contraseña.",
};

export default function PasswordRecoveryPage({ params }: PageProps) {
  const locale = params.locale ?? "es";

  return (
    <AuthCard
      locale={locale}
      title="Recupera tu contraseña"
      subtitle=""
    >
      <PasswordRecoveryForm locale={locale} />
    </AuthCard>
  );
}
