import { useCallback, useEffect, useState } from "react";
import {
  clearSession,
  getAuthenticatedUser,
  getErrorMessage,
  isUnauthorizedError,
  loadSession,
  login,
  saveSession,
} from "../api";
import { AuthSession, LoginInput } from "../types/Auth";

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const clearCurrentSession = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const handleUnauthorized = useCallback(
    (error: unknown): boolean => {
      if (!isUnauthorizedError(error)) {
        return false;
      }
      clearCurrentSession();
      setAuthErrorMessage("Sua sessão expirou. Faça login novamente.");
      return true;
    },
    [clearCurrentSession]
  );

  useEffect(() => {
    if (!session?.token) {
      setIsCheckingSession(false);
      return;
    }

    let isMounted = true;
    setIsCheckingSession(true);

    void (async () => {
      try {
        const user = await getAuthenticatedUser();
        if (!isMounted) {
          return;
        }
        const nextSession: AuthSession = {
          ...session,
          user,
        };
        setSession(nextSession);
        saveSession(nextSession);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        clearCurrentSession();
        setAuthErrorMessage(getErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [session?.token, clearCurrentSession]);

  const handleLogin = async (input: LoginInput): Promise<void> => {
    setIsLoggingIn(true);
    setAuthErrorMessage(null);
    try {
      const authSession = await login(input);
      saveSession(authSession);
      setSession(authSession);
    } catch (error) {
      setAuthErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = useCallback(() => {
    clearCurrentSession();
    setAuthErrorMessage(null);
  }, [clearCurrentSession]);

  return {
    session,
    isCheckingSession,
    authErrorMessage,
    setAuthErrorMessage,
    isLoggingIn,
    handleLogin,
    handleLogout,
    handleUnauthorized,
    clearCurrentSession,
  };
}
