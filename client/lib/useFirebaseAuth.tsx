"use client";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import {
  User,
  onAuthStateChanged as _onAuthStateChanged,
  Unsubscribe,
} from "firebase/auth";

type AuthUser = {
  uid: string;
  email: string | null;
  token?: string;
};

const formatAuthUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const authStateChanged = async (authState: User | null) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      // Optionally, clear the token from localStorage or cookies
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Clear token cookie
      localStorage.removeItem("token"); // Clear token from localStorage
      console.log(window.location.pathname);
      if (!window.location.pathname.includes("login")) {
        window.location.href = "/login";
      }
      return;
    }

    setLoading(true);

    const formattedUser = formatAuthUser(authState);
    // If you need to fetch the token, you can do it here
    const token = await authState.getIdToken();
    if (token) {
      formattedUser.token = token;
      document.cookie = `token=${token}; path=/; secure; samesite=strict`; // Store token in a cookie
      // Optionally, store the token in localStorage or context
      localStorage.setItem("token", token);
    }

    setAuthUser(formattedUser);

    setLoading(false);
  };

  const onAuthStateChanged = (cb: (user: User | null) => void): Unsubscribe => {
    return _onAuthStateChanged(auth, cb);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
  };
}
