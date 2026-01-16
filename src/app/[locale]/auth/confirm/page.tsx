import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import ConfirmSignUpForm from "@/components/auth/ConfirmSignUpForm";

type PageProps = {
  params: {
    locale: string;
  };
};

export const metadata: Metadata = {
  title: "Confirmar cuenta",
  description: "Confirma tu cuenta de Pick con el código enviado por correo.",
};

export default function ConfirmSignUpPage({ params }: PageProps) {
  const locale = params.locale ?? "es";

  return (
    <AuthCard
      locale={locale}
      title="Confirma tu cuenta"
      subtitle="Ingresa el código que recibiste por correo para activar tu cuenta."
    >
      <ConfirmSignUpForm locale={locale} />
    </AuthCard>
  );
}
