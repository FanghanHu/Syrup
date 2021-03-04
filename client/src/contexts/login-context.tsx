import React, {createContext, useContext, useState} from "react";

export const LoginContext = createContext<LoginToken>({});
export const SetLoginContext = createContext({});

export type LoginToken = {
    userId?: number;
    hash?: string;
};

export function useLogin() {
    return useContext(LoginContext);
}

export function useSetLogin() {
    return useContext(SetLoginContext);
}

export function LoginProvider({children}) {
    const [loginToken, setLogin] = useState<LoginToken>({});

    return (
        <LoginContext.Provider value={loginToken}>
            <SetLoginContext.Provider value={setLogin}>
                {children}
            </SetLoginContext.Provider>
        </LoginContext.Provider>
    );
}