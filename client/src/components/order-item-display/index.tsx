import { Order, OrderItem } from "../../util/models";
import { OrderModel } from "../../util/price-calculation";
import "./style.css";

export interface OrderItemDisplayProps {
    order: Order;
    selectedItems: OrderItem[];
    setSelectedItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
}

export interface DisplayItems {
    amount: number;
    orderItems: OrderItem[];
    displayPrice?: string;
}

export default function OrderItemDisplay({order, setSelectedItems, selectedItems}: OrderItemDisplayProps) {
    //sort orderitems
    const orderModel = new OrderModel(order);
    const displayData: {text: any, reference: OrderItem}[] = [];
    for(const itemModel of orderModel.items) {
        displayData.push({text: itemModel.amount, reference: itemModel.orderItem});
        displayData.push({text: itemModel.name, reference: itemModel.orderItem});
        displayData.push({text: itemModel.eachPrice.subtotal, reference: itemModel.orderItem});
        for(const modifierModel of itemModel.items) {
            displayData.push({text: "", reference: modifierModel.orderItem});
            displayData.push({text: (modifierModel.amount!==1?modifierModel.amount + "× ":"") + modifierModel.name, reference: modifierModel.orderItem});
            displayData.push({text: modifierModel.total.subtotal, reference: modifierModel.orderItem});
        }
    }

    return (
        <div>
            <div className="order-item-display-grid">
                {displayData.map((data, index) => {
                    return (
                        <div className={selectedItems.includes(data.reference)?"selected":""} key={index} onClick={()=> {
                            const clickedItem = data.reference;
                            //TODO: allow selecting more than one item.
                            setSelectedItems([clickedItem]);
                        }}>
                            {data.text}
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