/**
 * this file contains all contexts providers
 */

import React from "react";
import { LoginProvider } from "./login-context";
import { OrderProvider } from "./order-context";

export default function ContextProviders({children}): JSX.Element {
    return (
        <LoginProvider>
            <OrderProvider>
                {children}
            </OrderProvider>
        </LoginProvider>
    )
}