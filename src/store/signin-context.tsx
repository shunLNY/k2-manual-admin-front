import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useState } from "react";
import type { AuthScreen, Tenant } from "@/utils/types";

type SignInContextData = {
  userTenants: Tenant[] | null;
  setUserTenants: Dispatch<SetStateAction<Tenant[] | null>>;
  hasVerified: boolean;
  setHasVerified: Dispatch<SetStateAction<boolean>>;
  screen: AuthScreen;
  setScreen: Dispatch<SetStateAction<AuthScreen>>;
}

const SignInContext = createContext<SignInContextData | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export function SignInContextProvider({ children }: Props) {
  const [hasVerified, setHasVerified] = useState(false);
  const [screen, setScreen] = useState<AuthScreen>('emailScreen');
  const [userTenants, setUserTenants] = useState<Tenant[] | null>(null);

  const contextValue: SignInContextData = {
    userTenants,
    setUserTenants,
    hasVerified,
    setHasVerified,
    screen,
    setScreen,
  };

  return (
    <SignInContext.Provider value={contextValue}>
      {children}
    </SignInContext.Provider>
  );
}

export const useSignIn = () => {
  const context = useContext(SignInContext);
  if (context === undefined) {
    throw new Error("useSignIn must be used within a SignInContextProvider");
  }
  return context;
};

export default SignInContext;