"use client";
import { createContext, useContext, ReactNode } from "react";
import useFirebaseAuth from "../lib/useFirebaseAuth";
import signOutFromApplication from "@/lib/auth";

type AuthUser = {
  uid: string;
  email: string | null;
  token?: string;
};

type AuthContextType = {
  authUser: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>; 
};

const AuthUserContext = createContext<AuthContextType>({
  authUser: null,
  loading: true,
  logout: async () => {
    signOutFromApplication();
  },
});

export function AuthUserProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseAuth();

  // Ensure logout is present in the context value
  const logout = async () => {
    await signOutFromApplication();
  };

  const contextValue: AuthContextType = {
    authUser: auth.authUser,
    loading: auth.loading,
    logout,
  };

  return (
    <AuthUserContext.Provider value={contextValue}>{children}</AuthUserContext.Provider>
  );
}

// custom hook to use the AuthUserContext and access authUser and loading
export const useAuth = () => useContext(AuthUserContext);
