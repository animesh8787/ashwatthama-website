"use client";

import { useEffect, useState, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8765/api/v1";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  displayName: string | null;
  isAdmin: boolean;
  isEmailVerified: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Check existing session on mount
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        if (cancelled) return;
        if (data.status === "success" && data.data) {
          const u = data.data;
          setState({
            user: {
              id: u.user_id,
              username: u.username,
              email: u.email,
              displayName: u.display_name || null,
              isAdmin: u.is_admin ?? false,
              isEmailVerified: u.email_verified ?? false,
            },
            loading: false,
            error: null,
          });
        } else {
          setState({ user: null, loading: false, error: null });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ user: null, loading: false, error: null });
      });
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "success") {
        throw new Error(data.error || data.detail || "Login failed");
      }
      const u = data.data.user;
      setState({
        user: {
          id: u.id,
          username: u.email || email,
          email: u.email || email,
          displayName: u.name || null,
          isAdmin: u.is_admin ?? false,
          isEmailVerified: u.email_verified ?? false,
        },
        loading: false,
        error: null,
      });
      return data.data;
    } catch (err: any) {
      setState((prev) => ({ ...prev, loading: false, error: err.message }));
      throw err;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, displayName?: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: email, password, display_name: displayName }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "success") {
        throw new Error(data.error || data.detail || "Signup failed");
      }
      await login(email, password);
      return data.data;
    } catch (err: any) {
      setState((prev) => ({ ...prev, loading: false, error: err.message }));
      throw err;
    }
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    }
    setState({ user: null, loading: false, error: null });
  }, []);

  const refreshUser = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      if (res.status === 200) {
        const data = await res.json();
        if (data.status === "success" && data.data) {
          const u = data.data;
          setState({
            user: {
              id: u.user_id,
              username: u.username,
              email: u.email,
              displayName: u.display_name || null,
              isAdmin: u.is_admin ?? false,
              isEmailVerified: u.email_verified ?? false,
            },
            loading: false,
            error: null,
          });
          return;
        }
      }
      setState({ user: null, loading: false, error: null });
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const resendVerification = useCallback(async () => {
    const res = await fetch(`${API_BASE}/auth/resend-verification`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      throw new Error(data.error || data.detail || "Failed to resend verification");
    }
    return data.data;
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      throw new Error(data.error || data.detail || "Failed to send reset email");
    }
    return data.data;
  }, []);

  const confirmResetPassword = useCallback(async (token: string, newPassword: string) => {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, new_password: newPassword }),
    });
    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      throw new Error(data.error || data.detail || "Failed to reset password");
    }
    return data.data;
  }, []);

  const requestInstallerDownload = useCallback(async () => {
    const res = await fetch(`${API_BASE}/installer/request-download`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      throw new Error(data.error || data.detail || "Failed to prepare download");
    }
    return data.data as { token: string; expires_in_seconds: number };
  }, []);

  return {
    ...state,
    login,
    signup,
    logout,
    refreshUser,
    resendVerification,
    resetPassword,
    confirmResetPassword,
    requestInstallerDownload,
    isAuthenticated: !!state.user,
    isEmailVerified: state.user?.isEmailVerified ?? false,
  };
}
