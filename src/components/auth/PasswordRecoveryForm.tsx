"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Button, Stack, TextField } from "@mui/material";
import NextLink from "next/link";
import { requestPasswordReset } from "@/services/auth-service";

type StatusState = {
  type: "success" | "error";
  message: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PasswordRecoveryForm({ locale = "es" }: { locale?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<StatusState | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailRegex.test(email.trim().toLowerCase())) {
      setStatus({ type: "error", message: "Ingresa un correo válido." });
      return;
    }

    setStatus(null);
    setSubmitting(true);

    try {
      const response = await requestPasswordReset({ email: email.trim().toLowerCase() });
      setStatus({ type: "success", message: response.message });
      setEmail("");
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "No pudimos procesar la solicitud.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const signInHref = `/${locale}/auth/sign-in`;

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit} noValidate>
      <TextField
        label="Correo asociado a tu cuenta"
        type="email"
        value={email}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
        required
        fullWidth
      />
      {status ? <Alert severity={status.type}>{status.message}</Alert> : null}
      <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
        {isSubmitting ? "Enviando…" : "Enviar instrucciones"}
      </Button>
      <Button
        component={NextLink}
        href={signInHref}
        variant="text"
        size="small"
        sx={{ alignSelf: "center" }}
      >
        ¿Recordaste tu contraseña? Inicia sesión
      </Button>
    </Stack>
  );
}
