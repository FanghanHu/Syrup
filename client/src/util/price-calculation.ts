/**
 * Order Price Model: an object with a hierarchy view of the order regarding to it's pricing
 * An example:
 * ```
 *  {
 *      items: [{
 *          amount: 1,
 *          name: "Ramen",
 *          modifiers: [
 *              {
 *                  amount: 1,
 *                  name: "30% Off",
 *                  price: {
 *                      subtotal: 0,
*                       tax: 0,
*                       total: 0
 *                  }
 *              }
 *          ]
 *          price: {
*               subtotal: 0,
*               tax: 0,
*               total: 0
 *          }
 *      }],
 *      price: {
 *          subtotal: 0,
 *          tax: 0,
 *          total: 0
 *      }
 *  }
 * ```
 */

import { Order, OrderItem } from "./models";

export interface PriceModel {
    subtotal: number;
    tax: number;
    total: number;
}

export interface SinglePriceModel {
    amount: number;
    name: string;
    price: PriceModel;
}

export interface ComplexPriceModel{
    modifiers: ComplexPriceModel[];
}

export interface OrderPriceModel {
    items: ComplexPriceModel[];
    price: PriceModel;
}

class ItemModel implements ComplexPriceModel {
    modifiers: ComplexPriceModel[] = [];
    amount: number;
    name: string;
    price: PriceModel = {
        subtotal: 0,
        tax: 0,
        total: 0
    };
    priceModifier: number = 0;

    constructor(orderItem: OrderItem) {
        const itemAmount: number = orderItem.amount || 0;
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
            this.price.subtotal += priceNum
            this.price.tax += priceNum * itemTax;
            this.price.total = this.price.subtotal + this.price.tax;
            //TODO: process modifiers
        }
    }

    /**
     * This methods is used to update price on total modifying items after all other items are accounted for
     * @param total an unmodified price model
     */
    update(total: PriceModel) {
        this.price.subtotal = total.subtotal * this.priceModifier;
        this.price.tax = total.tax * this.priceModifier;
        this.price.total = total.total * this.priceModifier;
    }
}

class OrderModel implements OrderPriceModel {
    //this array contains all items, including everything in orderModifyingItem
    items: ComplexPriceModel[] = [];

    //these items modify the price on the whole order level, 
    //each item will impact the price in a multiplicative manner
    orderModifyingItem: ComplexPriceModel[] = []; 

    //price will have all current order modifying item applied
    price: PriceModel = {
        subtotal: 0,
        tax: 0,
        total: 0
    };

    //a price model before any order modifying item is applied
    unmodifiedPrice: PriceModel = {
        subtotal: 0,
        tax: 0,
        total: 0
    };

    addOrderItem(orderItem: OrderItem) {
        const item = new ItemModel(orderItem);
        this.items.push(item);
    }
}