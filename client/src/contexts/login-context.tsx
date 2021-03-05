import React, {createContext, useContext, useState} from "react";

export const LoginContext = createContext<LoginToken>({});
export const SetLoginContext = createContext< React.Dispatch<React.SetStateAction<LoginToken>>>({} as  React.Dispatch<React.SetStateAction<LoginToken>>);

export type LoginToken = {
    fullName?: string;
    userId?: number;
    hash?: string;
};

export function useLoginToken() {
    return useContext(LoginContext);
}

export function useSetLoginToken() {
    return useContext(SetLoginContext);
}

export function LoginProvider({children}) {
    const [loginToken, setLoginToken] = useState<LoginToken>({});

    return (
        <LoginContext.Provider value={loginToken}>
            <SetLoginContext.Provider value={setLoginToken}>
                {children}
            </SetLoginContext.Provider>
        </LoginContext.Provider>
    );
}