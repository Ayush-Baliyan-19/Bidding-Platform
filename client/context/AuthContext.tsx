"use client";
import { createContext, useContext, ReactNode } from "react";
import useFirebaseAuth from "../lib/useFirebaseAuth";

type AuthUser = {
  uid: string;
  email: string | null;
  token?: string;
};

type AuthContextType = {
  authUser: AuthUser | null;
  loading: boolean;
};

const AuthUserContext = createContext<AuthContextType>({
  authUser: null,
  loading: true,
});

export function AuthUserProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
}

// custom hook to use the AuthUserContext and access authUser and loading
export const useAuth = () => useContext(AuthUserContext);
