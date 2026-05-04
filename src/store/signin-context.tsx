import { createContext, Dispatch, useState } from "react";

type SignInContextData = {
  uTenants: null | undefined;
  setUTenants: Dispatch<any>;
  hasVerified: boolean;
  setHasVerified: Dispatch<any>;
  screen: string;
  setScreen: Dispatch<any>;
}

const SignInContext = createContext<SignInContextData>({
  uTenants: null,
  setUTenants: () => { },
  hasVerified: false,
  setHasVerified: () => { },
  screen: 'emailScreen',
  setScreen: () => { }
});

type Props = {
  children: React.ReactNode;
};


export function SignInContextProvider({ children }: Props) {
  const [hasVerified, setHasVerified] = useState(false)
  const [screen, setScreen] = useState('emailScreen');
  // user tenants
  const [uTenants, setUTenants] = useState();
  const context = {
    uTenants,
    setUTenants,
    hasVerified,
    setHasVerified,
    screen,
    setScreen,
  }

  return (
    <SignInContext.Provider value={context}>
      {children}
    </SignInContext.Provider>
  )
}

export default SignInContext;