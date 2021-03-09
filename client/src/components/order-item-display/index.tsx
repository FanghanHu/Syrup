import { deepEqual } from "../../util/helpers";
import { Order, OrderItem } from "../../util/models";

export interface OrderItemDisplayProps {
    order: Order;
}

export interface DisplayItems {
    amount: number;
    orderItems: OrderItem[];
    displayPrice?: string;
}

//TODO: 
export default function OrderItemDisplay({order}: OrderItemDisplayProps) {
    //sort orderitems
    const orderItems = order.OrderItems;
    let subTotal = 0;
    let tax = 0;
    let total = 0;

    let priceModifier = 1;

    /**
     * display items in groups, each group will hold identical orderItems, 
     */
    const displayItems:DisplayItems[] = [];

    if(orderItems) {
        let added = false;
        for(const orderItem of orderItems) {
            //loop through already processed items, see if there is a same item.
            for(const displayItem of displayItems) {
                if(deepEqual(displayItem.orderItems[0], orderItem)) {
                    //found the same item, amount + 1
                    displayItem.amount += 1;
                    displayItem.orderItems.push(orderItem);
                    added = true;
                    break;
                }
            }

            if(!added) {
                //didn't find same item, creating a new display item
                displayItems.push({
                    amount: 1,
                    orderItems: [orderItem]
                });
            }

            const itemPrice = orderItem.itemData?.price;
            //calculate subtotal and tax
            if(itemPrice) {
                if(itemPrice.endsWith("%")) {
                    let modifier = parseFloat(itemPrice.substring(0, itemPrice.length-1)) / 100;
                    priceModifier += modifier;
                } else {
                    const itemPriceNumber = parseFloat(itemPrice);
                    subTotal += itemPriceNumber;
                    const itemTax = orderItem.itemData?.tax
                    if(itemTax) {
                        tax += itemPriceNumber * itemTax;
                    }
                }
            }
        }

        subTotal = parseFloat((subTotal * priceModifier).toFixed(2));
        tax = parseFloat((tax * priceModifier).toFixed(2));
        total = subTotal + tax;
    }

    //setup display prices
    for(const displayItem of displayItems) {
        const itemPrice = displayItem.orderItems[0].itemData?.price;
        if(itemPrice) {
            if(itemPrice.endsWith("%")) {
                const modifier = parseFloat(itemPrice.substring(0, itemPrice.length-1)) / 100;
                const priceChange = modifier * subTotal * displayItem.amount;
                displayItem.displayPrice = `${priceChange < 0? "-$":"$"}${Math.abs(priceChange).toFixed(2)}`
            } else {
                let price = parseFloat(itemPrice) * displayItem.amount;
                displayItem.displayPrice = `${price<0?"-$":"$"}${Math.abs(price).toFixed(2)}`
            }
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
                {displayItems.map((displayItem, index) => {
                    return (<>
                        <div key={index + "-1"}>
                            {displayItem.amount}
                        </div>
                        <div key={index + "-2"}>
                            {displayItem.orderItems[0].itemData?.itemName}
                        </div>
                        <div key={index + "-3"}>
                            {displayItem.displayPrice}
                        </div>
                    </>);
                })}
            </div>
            <hr/>
            <div style={{
                textAlign: "right"
            }}>
                <div style={{fontSize: "0.5em"}}>SubTotal: ${subTotal}</div>
                <div style={{fontSize: "0.5em"}}>Tax: ${tax}</div>
                <div style={{fontWeight: 600}}>Total: ${total}</div>
            </div>
        </div>
    );
}