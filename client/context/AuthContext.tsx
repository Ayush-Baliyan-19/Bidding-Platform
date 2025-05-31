"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import useFirebaseAuth from "../lib/useFirebaseAuth";
import signOutFromApplication from "@/lib/auth";
import { api } from "@/lib/utils"; // your axios instance

type AuthUser = {
  uid: string;
  email: string | null;
  token?: string;
};

type AuthContextType = {
  authUser: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  routes: string[]; // expose allowed routes
};

const AuthUserContext = createContext<AuthContextType>({
  authUser: null,
  loading: true,
  logout: async () => {
    signOutFromApplication();
  },
  routes: [], // default
});

export function AuthUserProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseAuth();
  const [routes, setRoutes] = useState<string[]>([]);

  const logout = async () => {
    await signOutFromApplication();
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      if (auth.authUser) {
        try {
          const res = await api.get("/auth/routes", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authUser.token}`,
            },
          });
          setRoutes(res.data.routes || []);
        } catch (err) {
          console.error("Failed to fetch routes", err);
          setRoutes([]);
        }
      } else {
        setRoutes([]);
      }
    };

    fetchRoutes();
  }, [auth.authUser]);

  const contextValue: AuthContextType = {
    authUser: auth.authUser,
    loading: auth.loading,
    logout,
    routes,
  };

  return (
    <AuthUserContext.Provider value={contextValue}>
      {children}
    </AuthUserContext.Provider>
  );
}

export const useAuth = () => useContext(AuthUserContext);
