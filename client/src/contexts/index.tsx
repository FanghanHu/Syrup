/**
 * this file contains all contexts providers
 */

import React from "react";
import { LoginProvider } from "./login-context";

export default function ContextProviders({children}): JSX.Element {
    return (
        <LoginProvider>
            {children}
        </LoginProvider>
    )
}