"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  ACTIVE_TERMS_VERSION,
  buildContractUrl,
  buildPrivacyUrl,
} from "@/constants/consent";
import { registerUser } from "@/services/auth-service";

type FormState = {
  displayName: string;
  email: string;
  password: string;
};

type StatusState = {
  type: "success" | "error";
  message: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PENDING_SIGNUP_KEY = "pick:pending-signup";
const authFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
  },
  "& .MuiOutlinedInput-input": {
    px: 1.6,
    py: 1.55,
  },
};

export default function SignUpForm({ locale = "es" }: { locale?: string }) {
  const [form, setForm] = useState<FormState>({
    displayName: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState<StatusState | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  const termsHref = buildContractUrl(locale);
  const privacyHref = buildPrivacyUrl(locale);
  const checkboxLabelSx = {
    alignItems: "center",
    gap: 0.75,
    m: 0,
    "& .MuiCheckbox-root": {
      p: 0.75,
    },
    "& .MuiFormControlLabel-label": {
      lineHeight: 1.5,
    },
  };

  const handleChange = (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const validate = () => {
    if (form.displayName.trim().length < 3) {
      setStatus({ type: "error", message: "Tu nombre visible debe tener al menos 3 caracteres." });
      return false;
    }

    if (!emailRegex.test(form.email.trim().toLowerCase())) {
      setStatus({ type: "error", message: "Ingresa un correo válido." });
      return false;
    }

    if (form.password.length < 8) {
      setStatus({ type: "error", message: "La contraseña debe tener mínimo 8 caracteres." });
      return false;
    }

    if (!isAdult) {
      setStatus({ type: "error", message: "Debes confirmar que eres mayor de edad." });
      return false;
    }

    if (!acceptedTerms) {
      setStatus({
        type: "error",
        message: "Debes aceptar el contrato de servicio y privacidad para crear la cuenta.",
      });
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
      const payload = {
        displayName: form.displayName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        ageConfirmed: isAdult,
        acceptTerms: true,
        termsVersion: ACTIVE_TERMS_VERSION,
        locale,
      };

      await registerUser(payload);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          PENDING_SIGNUP_KEY,
          JSON.stringify({
            email: payload.email,
            displayName: payload.displayName,
          }),
        );
      }
      const confirmHref = `/${locale}/auth/confirm?email=${encodeURIComponent(payload.email)}`;
      router.push(confirmHref);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "No pudimos crear la cuenta.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const signInHref = `/${locale}/auth/sign-in`;

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit} noValidate>
      <TextField
        label="Nombre visible"
        value={form.displayName}
        onChange={handleChange("displayName")}
        required
        fullWidth
        sx={authFieldSx}
      />
      <TextField
        label="Correo electrónico"
        type="email"
        value={form.email}
        onChange={handleChange("email")}
        required
        fullWidth
        sx={authFieldSx}
      />
      <TextField
        label="Contraseña"
        type="password"
        value={form.password}
        onChange={handleChange("password")}
        required
        fullWidth
        helperText="Mínimo 8 caracteres."
        sx={authFieldSx}
      />
      <FormControlLabel
        sx={checkboxLabelSx}
        control={
          <Checkbox
            checked={isAdult}
            onChange={(event) => setIsAdult(event.target.checked)}
            required
          />
        }
        label={
          <Typography
            variant="body2"
            component="span"
            sx={{ display: "inline", lineHeight: 1.5 }}
          >
            Confirmo que soy mayor de edad.
          </Typography>
        }
      />
      <FormControlLabel
        sx={checkboxLabelSx}
        control={
          <Checkbox
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            required
          />
        }
        label={
          <Stack spacing={0.2}>
            <Typography
              variant="body2"
              component="span"
              sx={{ display: "block", lineHeight: 1.5 }}
            >
              Autorizo el tratamiento de mis datos personales y acepto los{" "}
              <Link
                component={NextLink}
                href={termsHref}
                underline="hover"
                sx={{
                  fontSize: "inherit",
                  lineHeight: "inherit",
                  display: "inline",
                  verticalAlign: "baseline",
                }}
              >
                términos de servicio
              </Link>{" "}
              y el{" "}
              <Link
                component={NextLink}
                href={privacyHref}
                underline="hover"
                sx={{
                  fontSize: "inherit",
                  lineHeight: "inherit",
                  display: "inline",
                  verticalAlign: "baseline",
                }}
              >
                aviso de privacidad
              </Link>
              .
            </Typography>
            <Typography variant="caption" color="text.secondary" component="span">
              Versión vigente: {ACTIVE_TERMS_VERSION}
            </Typography>
          </Stack>
        }
      />
      {status ? <Alert severity={status.type}>{status.message}</Alert> : null}
      <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
        {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
      <Button
        component={NextLink}
        href={signInHref}
        variant="text"
        size="small"
        sx={{ alignSelf: "center" }}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </Stack>
  );
}
