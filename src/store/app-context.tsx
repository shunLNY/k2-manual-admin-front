/** @format */

import React, { Dispatch, createContext, useState } from 'react';

type AppContextType = {
  items: string[];
  setItems: Dispatch<any>;
};

const AppContext = createContext<AppContextType>({
  items: [],
  setItems: () => {},
});

type Props = {
  children: React.ReactNode;
};

export function AppContextProvider({ children }: Props) {
  const [items, setItems] = useState([]);

  const context = {
    items,
    setItems,
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
