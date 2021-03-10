import { Order, OrderItem } from "../../util/models";
import { OrderModel } from "../../util/price-calculation";

export interface OrderItemDisplayProps {
    order: Order;
}

export interface DisplayItems {
    amount: number;
    orderItems: OrderItem[];
    displayPrice?: string;
}

export default function OrderItemDisplay({order}: OrderItemDisplayProps) {
    //sort orderitems
    const orderModel = new OrderModel(order);
    console.log(orderModel);
    const displayData: any[] = [];
    for(const itemModel of orderModel.items) {
        displayData.push(itemModel.amount);
        displayData.push(itemModel.name);
        displayData.push(itemModel.eachPrice.subtotal);
        for(const modifierModel of itemModel.items) {
            displayData.push("");
            displayData.push((modifierModel.amount!==1?modifierModel.amount + "× ":"") + modifierModel.name);
            displayData.push(modifierModel.total.subtotal);
        }
    }

    return (
        <div>
            <div style={{
                display: "grid",
                gridTemplateColumns: "min-content auto min-content",
                gridAutoRows: "min-content",
                gap: "3px",
                height: "100%",
                overflowY: "auto",
                alignItems: "center",
                justifyItems: "center"
                
            }}>
                {displayData.map((data, index) => {
                    return (
                        <div key={index}>
                            {data}
                        </div>
                    );
                })}
            </div>
            <hr/>
            <div style={{
                textAlign: "right"
            }}>
                <div style={{fontSize: "0.5em"}}>SubTotal: {orderModel.total.subtotal}</div>
                <div style={{fontSize: "0.5em"}}>Tax: {orderModel.total.tax}</div>
                <div style={{fontWeight: 600}}>Total: {orderModel.total.total}</div>
            </div>
        </div>
    );
}