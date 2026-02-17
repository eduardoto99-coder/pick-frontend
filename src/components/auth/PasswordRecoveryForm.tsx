"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { confirmPasswordReset, requestPasswordReset } from "@/services/auth-service";

type StatusState = {
  type: "success" | "error";
  message: string;
};

type RecoveryStep = "request" | "confirm" | "done";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PasswordRecoveryForm({ locale = "es" }: { locale?: string }) {
  const [step, setStep] = useState<RecoveryStep>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<StatusState | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();

  const normalizedEmail = email.trim().toLowerCase();
  const signInHref = `/${locale}/auth/sign-in`;

  useEffect(() => {
    if (step !== "done") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.replace(signInHref);
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [router, signInHref, step]);

  const handleRequestCode = async () => {
    const response = await requestPasswordReset({ email: normalizedEmail });
    setStatus({ type: "success", message: response.message });
    setStep("confirm");
  };

  const handleConfirmReset = async () => {
    if (!code.trim()) {
      setStatus({ type: "error", message: "Ingresa el código de recuperación." });
      return;
    }

    if (newPassword.length < 8) {
      setStatus({ type: "error", message: "La nueva contraseña debe tener mínimo 8 caracteres." });
      return;
    }

    const response = await confirmPasswordReset({
      email: normalizedEmail,
      code: code.trim(),
      newPassword,
    });

    setStatus({ type: "success", message: response.message });
    setCode("");
    setNewPassword("");
    setStep("done");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailRegex.test(normalizedEmail)) {
      setStatus({ type: "error", message: "Ingresa un correo válido." });
      return;
    }

    setStatus(null);
    setSubmitting(true);

    try {
      if (step === "request") {
        await handleRequestCode();
      } else {
        await handleConfirmReset();
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "No pudimos procesar la solicitud.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit} noValidate>
      {step !== "done" ? (
        <>
          <TextField
            label="Correo asociado a tu cuenta"
            type="email"
            value={email}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
            required
            fullWidth
          />

          {step === "confirm" ? (
            <>
              <TextField
                label="Código de recuperación"
                value={code}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setCode(event.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Nueva contraseña"
                type="password"
                value={newPassword}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)}
                required
                fullWidth
                helperText="Mínimo 8 caracteres."
              />
              <Button
                type="button"
                variant="text"
                size="small"
                onClick={() => {
                  setStep("request");
                  setCode("");
                  setNewPassword("");
                  setStatus(null);
                }}
                sx={{ alignSelf: "flex-start" }}
              >
                Solicitar un nuevo código
              </Button>
            </>
          ) : null}
        </>
      ) : null}

      {status ? <Alert severity={status.type}>{status.message}</Alert> : null}

      {step === "done" ? (
        <>
          <Typography variant="body2" color="text.secondary">
            Redirigiendo al inicio de sesión...
          </Typography>
          <Button component={NextLink} href={signInHref} variant="contained" size="large">
            Ir a iniciar sesión
          </Button>
        </>
      ) : (
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {step === "request"
            ? isSubmitting
              ? "Enviando…"
              : "Enviar código"
            : isSubmitting
              ? "Actualizando…"
              : "Actualizar contraseña"}
        </Button>
      )}

      {step !== "done" ? (
        <Button
          component={NextLink}
          href={signInHref}
          variant="text"
          size="small"
          sx={{ alignSelf: "center" }}
        >
          ¿Recordaste tu contraseña? Inicia sesión
        </Button>
      ) : null}
    </Stack>
  );
}
