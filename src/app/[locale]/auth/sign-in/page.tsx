import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import SignInForm from "@/components/auth/SignInForm";

type PageProps = {
  params: {
    locale: string;
  };
};

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Inicia sesión en Pick.",
};

export default function SignInPage({ params }: PageProps) {
  const locale = params.locale ?? "es";

  return (
    <AuthCard
      locale={locale}
      title="Inicia sesión"
    >
      <SignInForm locale={locale} />
    </AuthCard>
  );
}
