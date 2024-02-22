import { createContext } from "react";

export const AppContext = createContext({
    names: '',
    email: '',
    network: false,
    setNames: (n: string) => {},
    setEmail: (e: string) => {},
    setNetwork: (n: boolean) => {},
});



