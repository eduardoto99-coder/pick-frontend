"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { confirmSignUp, loginUser } from "@/services/auth-service";
import { useAccountLinks } from "@/hooks/use-account-links";
import { persistStoredDisplayName } from "@/utils/local-user";

type FormState = {
  code: string;
};

type StatusState = {
  type: "error" | "success";
  message: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PENDING_SIGNUP_KEY = "pick:pending-signup";

type PendingSignup = {
  email?: string;
  password?: string;
  displayName?: string;
};

function readPendingSignup(): PendingSignup {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.sessionStorage.getItem(PENDING_SIGNUP_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as PendingSignup;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export default function ConfirmSignUpForm({ locale = "es" }: { locale?: string }) {
  const [form, setForm] = useState<FormState>({ code: "" });
  const [status, setStatus] = useState<StatusState | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [pendingPassword, setPendingPassword] = useState<string | null>(null);
  const [pendingDisplayName, setPendingDisplayName] = useState<string | null>(null);
  const { persistSession } = useAccountLinks(locale);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const emailFromQuery = params.get("email")?.trim().toLowerCase() ?? "";
    const pending = readPendingSignup();
    const storedEmail =
      typeof pending.email === "string" ? pending.email.trim().toLowerCase() : "";
    const storedPassword =
      typeof pending.password === "string" ? pending.password : null;
    const storedDisplayName =
      typeof pending.displayName === "string" ? pending.displayName.trim() : "";

    const resolvedEmail = emailFromQuery || storedEmail;
    if (resolvedEmail) {
      setEmail(resolvedEmail);
    }
    if (storedPassword) {
      setPendingPassword(storedPassword);
    }
    if (storedDisplayName) {
      setPendingDisplayName(storedDisplayName);
    }
  }, []);

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, code: event.target.value }));
  };

  const normalizedEmail = email.trim().toLowerCase();
  const hasEmail = emailRegex.test(normalizedEmail);

  const validate = () => {
    if (!hasEmail) {
      setStatus({
        type: "error",
        message: "No encontramos tu correo. Regresa a crear la cuenta.",
      });
      return false;
    }

    if (!form.code.trim()) {
      setStatus({ type: "error", message: "Ingresa el código de confirmación." });
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
      const response = await confirmSignUp({
        email: normalizedEmail,
        code: form.code.trim().replace(/\s/g, ""),
      });

      if (pendingDisplayName) {
        persistStoredDisplayName(pendingDisplayName);
      }

      if (pendingPassword) {
        try {
          const loginResponse = await loginUser({
            email: normalizedEmail,
            password: pendingPassword,
          });

          if (!loginResponse.userId) {
            throw new Error("No pudimos iniciar sesión automáticamente.");
          }

          persistSession(loginResponse.userId);
          router.replace(`/${locale}/profile`);
          return;
        } catch (error) {
          setStatus({
            type: "success",
            message:
              error instanceof Error
                ? `${response.message ?? "Cuenta confirmada."} ${error.message}`
                : "Cuenta confirmada. Inicia sesión para continuar.",
          });
          return;
        } finally {
          if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(PENDING_SIGNUP_KEY);
          }
          setPendingPassword(null);
        }
      }

      setStatus({
        type: "success",
        message: response.message ?? "Cuenta confirmada. Ya puedes iniciar sesión.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "No pudimos confirmar tu cuenta.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit} noValidate>
      <Typography variant="body2" color="text.secondary">
        Te enviamos un código de 6 dígitos por correo. Escríbelo aquí para activar tu cuenta.
      </Typography>
      <TextField
        label="Código de confirmación"
        value={form.code}
        onChange={handleCodeChange}
        required
        fullWidth
        inputProps={{ inputMode: "numeric" }}
      />
      {status ? <Alert severity={status.type}>{status.message}</Alert> : null}
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Confirmando…" : "Confirmar cuenta"}
      </Button>
    </Stack>
  );
}
