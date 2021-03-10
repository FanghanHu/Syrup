import { Order, OrderItem } from "./models";

export interface PriceModel {
    subtotal: number;
    tax: number;
    total: number;
}

function round(num:number): number {
    return parseFloat(num.toFixed(2));
}

/**
 * A complex price model may modify its parent's total by addition or multiplication,
 */
class ComplexModel {
    items: ComplexModel[] = [];
    amount: number = 1;
    priceModifier: number = 0;

    /**
     * the price for each of this item and this item only, not accounting it's children items.
     */
    eachPrice: PriceModel = {
        subtotal: 0,
        tax: 0,
        total: 0
    };

    /**
     * the total cost for this item, accounting the amount, and children items.
     */
    total: PriceModel = {
        subtotal: 0,
        tax: 0,
        total: 0
    }

    addChild(child: ComplexModel) {
        this.items.push(child);
    }

    /**
     * This methods is used to update price on total modifying items after all other items are accounted for
     * @param parentAdditiveTotal an unmodified price model
     */
    updateSelf(parentAdditiveTotal: PriceModel) {
        if(this.priceModifier) {
            //self is a multiplicative item, ignore children, update owm total.
            this.total.subtotal = round(parentAdditiveTotal.subtotal * this.priceModifier * this.amount);
            this.total.tax = round(parentAdditiveTotal.tax * this.priceModifier * this.amount);
            this.total.total = round(parentAdditiveTotal.total * this.priceModifier * this.amount);
        } else {
            //self is additive, update children items
            let additiveTotal:PriceModel = {
                ...this.eachPrice
            }

            //add all additive items together
            for(const item of this.items){
                if(item.priceModifier === 0) {
                    //update item's childrens first
                    item.updateSelf(additiveTotal);
                    item.updateTotal(additiveTotal);
                }
            }

            //update all multiplicative items to have an additive price
            for(const item of this.items){
                if(item.priceModifier !== 0) {
                    item.updateSelf(additiveTotal);
                }
            }

            //now every child item have a total price
            const modifiedEachPrice: PriceModel = {
                ...this.eachPrice
            }
            //add everything together
            for(const item of this.items){ 
                item.updateTotal(modifiedEachPrice);
            }

            //account for amount
            this.total = {
                subtotal: round(modifiedEachPrice.subtotal * this.amount),
                tax: round(modifiedEachPrice.tax * this.amount),
                total: round((modifiedEachPrice.subtotal + modifiedEachPrice.tax) * this.amount)
            }
        }
    }

    /**
     * change the given total using it's own price, 
     * A multiplicative model must make sure parent accounted all additive child and update self first.
     * @param total 
     */
    updateTotal(total: PriceModel) {
        total.subtotal += this.total.subtotal;
        total.tax += this.total.tax;
        total.total += this.total.total;
    }
}

export class ItemModel extends ComplexModel {
    name: string;
    items: ItemModel[] = [];
    orderItem: OrderItem;
    constructor(orderItem: OrderItem) {
        super();
        this.orderItem = orderItem;
        const itemAmount: number = orderItem.amount || 1;
        const itemPrice: string = orderItem.itemData?.price || "";
        const itemTax: number = orderItem.itemData?.tax || 0;
        const itemName: string = orderItem.itemData?.itemName || "";

        this.amount = itemAmount;
        this.name = itemName;

        if(itemPrice.endsWith("%")) {
            //total modifying item
            this.priceModifier = parseFloat(itemPrice.substring(0, itemPrice.length-1))/100;
            //modifiers are ignored on order modifying items.
        } else {
            //normal item
            const priceNum = parseFloat(itemPrice);
            this.eachPrice.subtotal += priceNum
            this.eachPrice.tax += priceNum * itemTax;
            this.eachPrice.total = this.eachPrice.subtotal + this.eachPrice.tax;
        }

        //add modifiers, but not update yet.
        if(orderItem.Modifiers) {
            for(const modifier of orderItem.Modifiers) {
                this.addChild(new ItemModel(modifier));
            }
        }
    }
}

export class OrderModel extends ComplexModel {
    order: Order;
    items: ItemModel[] = [];
    constructor(order: Order) {
        super();
        this.order = order;

        //add items
        if(order.OrderItems) {
            for(const orderItem of order.OrderItems) {
                this.addChild(new ItemModel(orderItem));
            }
        }

        //update after all orderitems are added
        this.updateSelf(this.total);
    }
}