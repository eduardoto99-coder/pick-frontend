"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Button, Stack, TextField } from "@mui/material";
import NextLink from "next/link";
import { loginUser } from "@/services/auth-service";
import { useAccountLinks } from "@/hooks/use-account-links";
import { useRouter } from "next/navigation";
import { persistStoredDisplayName } from "@/utils/local-user";

type FormState = {
  email: string;
  password: string;
};

type StatusState = {
  type: "error" | "success";
  message: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInForm({ locale = "es" }: { locale?: string }) {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [status, setStatus] = useState<StatusState | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const { persistSession } = useAccountLinks(locale);
  const router = useRouter();

  const handleChange = (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const validate = () => {
    if (!emailRegex.test(form.email.trim().toLowerCase())) {
      setStatus({ type: "error", message: "Ingresa un correo válido." });
      return false;
    }

    if (!form.password) {
      setStatus({ type: "error", message: "La contraseña es obligatoria." });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const response = await loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (!response.userId || (!response.idToken && !response.accessToken)) {
        setStatus({
          type: "error",
          message: "No pudimos iniciar sesión. Intenta nuevamente.",
        });
        return;
      }

      persistSession({
        userId: response.userId,
        accessToken: response.accessToken,
        idToken: response.idToken,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn,
      });
      if (typeof response.displayName === "string" && response.displayName.trim().length > 0) {
        persistStoredDisplayName(response.displayName.trim());
      }
      setStatus({
        type: "success",
        message: "Inicio de sesión exitoso. Cargando tu perfil…",
      });
      const profileHref = `/${locale}/profile`;
      router.push(profileHref);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "No pudimos iniciar sesión.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const signUpHref = `/${locale}/auth/sign-up`;
  const recoveryHref = `/${locale}/auth/recover`;

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit} noValidate>
      <TextField
        label="Correo electrónico"
        type="email"
        value={form.email}
        onChange={handleChange("email")}
        required
        fullWidth
      />
      <TextField
        label="Contraseña"
        type="password"
        value={form.password}
        onChange={handleChange("password")}
        required
        fullWidth
      />
      <Button
        component={NextLink}
        href={recoveryHref}
        variant="text"
        size="small"
        sx={{ alignSelf: "flex-start" }}
      >
        ¿Olvidaste tu contraseña?
      </Button>
      {status ? <Alert severity={status.type}>{status.message}</Alert> : null}
      <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
        {isSubmitting ? "Ingresando…" : "Iniciar sesión"}
      </Button>
      <Button
        component={NextLink}
        href={signUpHref}
        variant="text"
        size="small"
        sx={{ alignSelf: "center" }}
      >
        ¿Nuevo en Pick? Crea una cuenta
      </Button>
    </Stack>
  );
}
