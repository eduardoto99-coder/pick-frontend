import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import SignUpForm from "@/components/auth/SignUpForm";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const metadata: Metadata = {
  title: "Crea tu cuenta",
  description: "Regístrate en Pick.",
};

export default async function SignUpPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale ?? "es";

  return (
    <AuthCard
      locale={locale}
      title="Crea tu cuenta"
    >
      <SignUpForm locale={locale} />
    </AuthCard>
  );
}
