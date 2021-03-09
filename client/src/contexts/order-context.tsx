import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react"
import { Order } from "../util/models";


export const OrderContext = createContext<Order>({});
export const SetOrderContext = createContext<React.Dispatch<React.SetStateAction<Order>>>({} as React.Dispatch<React.SetStateAction<Order>>);

export function useOrder() {
    return useContext(OrderContext);
}

export function useSetOrder() {
    return useContext(SetOrderContext);
}

export function OrderProvider({children}) {
    const [order, setOrder] = useState<Order>({});

    return (
        <OrderContext.Provider value={order}>
            <SetOrderContext.Provider value={setOrder}>
                {children}
            </SetOrderContext.Provider>
        </OrderContext.Provider>
    );
}