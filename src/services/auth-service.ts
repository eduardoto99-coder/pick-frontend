export type RegisterInput = {
  email: string;
  password: string;
  displayName: string;
  acceptTerms: boolean;
  termsVersion: string;
  locale?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn?: number;
  tokenType?: string;
  userId?: string;
  email?: string;
};

export type RegisterResponse = {
  message?: string;
  email?: string;
  displayName?: string;
  termsVersion?: string;
  acceptedAt?: string;
};

export type ConfirmSignUpInput = {
  email: string;
  code: string;
};

export type ConfirmSignUpResponse = {
  message?: string;
  email?: string;
};

export type PasswordResetInput = {
  email: string;
};

export type PasswordResetResponse = {
  message: string;
  email: string;
};

function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("El backend no está configurado. Define NEXT_PUBLIC_API_URL.");
  }
  return apiUrl.replace(/\/$/, "");
}

async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function normalizeError(payload: unknown, fallback: string): string {
  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (typeof record.message === "string") {
      return record.message;
    }
    if (typeof record.error === "string") {
      return record.error;
    }
  }

  return fallback;
}

export async function registerUser(input: RegisterInput): Promise<RegisterResponse> {
  const response = await fetch(`${getApiUrl()}/auth/register`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(normalizeError(data, "No se pudo crear la cuenta."));
  }

  return (data as RegisterResponse) ?? {};
}

export async function loginUser(input: LoginInput): Promise<LoginResponse> {
  const response = await fetch(`${getApiUrl()}/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(normalizeError(data, "No se pudo iniciar sesión."));
  }

  return (data as LoginResponse) ?? {};
}

export async function confirmSignUp(
  input: ConfirmSignUpInput,
): Promise<ConfirmSignUpResponse> {
  const response = await fetch(`${getApiUrl()}/auth/confirm`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(normalizeError(data, "No pudimos confirmar tu cuenta."));
  }

  return (data as ConfirmSignUpResponse) ?? {};
}

export async function requestPasswordReset(
  input: PasswordResetInput,
): Promise<PasswordResetResponse> {
  // Placeholder until the Cognito ForgotPassword flow is available.
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    message:
      "Simulamos el envío del correo de recuperación. Integraremos Cognito cuando las credenciales estén listas.",
    email: input.email,
  } satisfies PasswordResetResponse;
}
