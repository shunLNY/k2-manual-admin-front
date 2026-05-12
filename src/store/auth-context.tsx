import { getSession, useSession } from "next-auth/react";
import React, { createContext, useMemo, useState, useEffect, useContext, type Dispatch, type SetStateAction } from "react";

type AuthContextData = {
  user: any; // next-auth user type is complex, leaving as any for now but could be refined
  setUser: Dispatch<SetStateAction<any>>;
  refreshUser: () => Promise<void>;
  hasOwnerPermission: boolean;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

type Props = {
  children: React.ReactNode
}

export function AuthContextProvider({ children }: Props) {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>({});
  
  useEffect(() => {
    if (session && session.user) {
      if (user === session.user) return;
      setUser(session.user);
    }
  }, [user, session]);

  const refreshUser = async () => {
    const newSession = await getSession();
    if (newSession?.user) {
      setUser((u: any) => ({ ...u, ...newSession.user }));
    }
  };

  const hasOwnerPermission = useMemo(() => {
    if (user) {
      return user.role === "admin";
    }
    return false;
  }, [user]);

  const context: AuthContextData = {
    setUser,
    user,
    refreshUser,
    hasOwnerPermission,
  };

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};

export default AuthContext;
