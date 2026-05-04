import { getSession, useSession } from "next-auth/react";
import { Dispatch } from "react";
import React, { createContext, useMemo, useState, useEffect } from "react";

type AuthContextData = {
  user: any;
  setUser: Dispatch<any>;
  refreshUser: Dispatch<any>;
  hasOwnerPermission: boolean;
}

const AuthContext = createContext<AuthContextData>({
  user: {},
  setUser: () => { },
  refreshUser: () => { },
  hasOwnerPermission: true,
});

type Props = {
  children: React.ReactNode
}

export function AuthContextProvider({ children }: Props) {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>({});
  // set user
  useEffect(() => {
    if (session && session.user) {
      if (user === session.user) return;
      setUser(session.user);
    }
  }, [user, session]);

  const refreshUser = async () => {
    const newSession = await getSession();
    setUser((u: any) => {
      return { ...u, ...newSession?.user };
    });
  };

  const hasOwnerPermission = useMemo(() => {
    if (user) {
      return user.role === "admin";
    }
    return false;
  }, [user]);

  // console.log(user, "...user....");
  const context: AuthContextData = {
    setUser,
    user,
    refreshUser,
    hasOwnerPermission,
  };

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
}
export default AuthContext;
