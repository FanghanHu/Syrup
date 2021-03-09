export interface Order {
    id?: number;
    orderNumber?: string;
    status?: string;
    cache?: OrderCache;
    type?: "Dine in" | "To Go" | "Pick up" | "Delivery";
    Table?: any;
    TableId?: number;
    Customers?: [];
    OrderItems?: OrderItem[];
    Server?: any;
    ServerId?: number;
    Payments?: [];
}

export interface OrderCache {
    subtotal: number;
    tax: number;
    total: number;
    [x: string]: any;
} 


export interface Item {
    id?: number;
    itemName?: string;
    price?: string;
    tax?: number;
    translation?: object;
}

export interface OrderItem {
    id?: number;
    itemData?: Item;
    status?: string; 
    Order?: Order;
    OrderId?: number;
    ServerId?: number;
    Item?: Item;
    ItemId?: number;
    OrderModifiers?: OrderModifier[];
}

export interface OrderModifier {
    id?: number;
    modifierData?: Modifier;
    Modifier?: Modifier;
    ModifierId?: number;
    OrderItem?: OrderItem;
    OrderItemId?: number;
    ServerId?: number;
}

export interface Modifier {
    id?: number;
    modifierName?: string;
    price?: string;
    tax?: number;
    translations?: object;
}