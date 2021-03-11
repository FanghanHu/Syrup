import { Order, OrderItem } from "../../util/models";
import { ItemModel, OrderModel } from "../../util/price-calculation";
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
    let key = 0;

    const renderList = (items: ItemModel[], modifierLevel: number) => {
        let renderedItems:JSX.Element[] = [];
        for(const item of items) {
            //render self
            let selfClassName = "order-item-display-grid";
            if(selectedItems.includes(item.orderItem)) selfClassName += " selected";
            if(modifierLevel === 0) selfClassName += " font-weight-bold";
            if(item.orderItem.status === "NEW") selfClassName += " new-item";
            key++;
            renderedItems.push(
                <div key={key} className={selfClassName} style={{
                    marginLeft: modifierLevel+"em"
                }} onClick={() => {
                    //TODO: modify this method to allow selection of multiple items
                    setSelectedItems([item.orderItem]);
                }}>
                    <div style={{
                        minWidth: "1em"
                    }}>{item.amount===1?"":item.amount}</div>
                    <div>{item.name}</div>
                    <div>{modifierLevel&&(item.eachPrice.subtotal>0)? "+" + item.eachPrice.subtotal: item.eachPrice.subtotal}</div>
                </div>
            );
            if(item.items && item.items.length) {
                //render children
                const renderedChildren = renderList(item.items, modifierLevel+1);
                renderedItems = renderedItems.concat(renderedChildren);
                
            }
        }
        return renderedItems;
    }

    return (
        <div>
            {renderList(orderModel.items, 0)}
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