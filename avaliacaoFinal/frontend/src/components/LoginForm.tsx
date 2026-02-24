import { FormEvent, useState } from "react";
import { LoginInput } from "../types/Auth";

interface LoginFormProps {
  isSubmitting: boolean;
  errorMessage: string | null;
  onLogin: (input: LoginInput) => Promise<void>;
}

export function LoginForm({ isSubmitting, errorMessage, onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (!email.trim() || !password.trim()) {
      setValidationError("Informe email e senha.");
      return;
    }

    await onLogin({
      email: email.trim(),
      password: password.trim(),
    });
  };

  return (
    <form className="login-form" onSubmit={(event) => void handleSubmit(event)}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="cliente1@email.com"
          required
        />
      </label>

      <label>
        Senha
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="123456"
          required
        />
      </label>

      {validationError ? <p className="error-message">{validationError}</p> : null}
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
