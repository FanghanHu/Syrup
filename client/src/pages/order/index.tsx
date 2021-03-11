import { Container } from "react-bootstrap";
import Button from "../../components/button";
import Panel from "../../components/panel";
import PanelBody from "../../components/panel-body";

import './style.css';
import "./mobile-style.css"
import PanelHeader from "../../components/panel-header";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Color } from "../../util/Color";
import OrderItemDisplay from "../../components/order-item-display";
import { useOrder, useSetOrder } from "../../contexts/order-context";
import { OrderItem } from "../../util/models";
import { constants } from "node:zlib";
import { deepEqual } from "../../util/helpers";

export default function Order() {
    const [mainButtons, setMainButtons] = useState([]);
    const [sideButtons, setSideButtons] = useState([]);
    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);

    const order = useOrder();
    const setOrder = useSetOrder();

    //TODO: function to orderItem, voidItem, decreaseAmount, increaseAmount, SendOrder.

    /**
     * Try to find the item inside the given array.
     * 
     * If the item is found, a copy of the original array is made, 
     * and the item will be replaced in the copy.
     * then the copy is returned
     * 
     * If item isn't found, return false.
     * @param orderItems the original array
     * @param orderItem the item to be replaced
     * @param newItem the replacement
     */
    const replaceItem = (originalList: OrderItem[], originalItem: OrderItem, newItem: OrderItem) => {
        //try to find in the outmost level
        for(let i=0; i< originalList.length; i++) {
            const orderItem = originalList[i];
            if(orderItem === originalItem) {
                //found, make a copy of the list, replace the item and return
                const newList = [...originalList];
                newList[i] = newItem;
                return newList;
            } else {
                //not found, check its modifiers
                if(orderItem.Modifiers) {
                    const newModifers = replaceItem(orderItem.Modifiers, originalItem, newItem);
                    if(newModifers) {
                        //found the item down the line, replace this item and it's children
                        const newList = [...originalList];
                        newList[i] = {...orderItem, Modifiers: newModifers};
                        return newList;
                    }
                }
            }
        }
        return false;
    }

    /**
     * compare everything except amount, timestamp
     */
    const compareItem = (item1: OrderItem, item2: OrderItem) => {
        return deepEqual({...item1, amount: 1, createdAt: "0", updatedAt: "0"},
            {...item2, amount: 1, createdAt: "0", updatedAt: "0"});
    }

    /**
     * merge all the same item inside the list together
     * also merges same modifier
     * @param originalList the list to merge
     * @param toBeSelectedItems the list of items that should be selected after the merge
     * @returns false if nothing is merged, or new list of merged items.
     */
    const mergeSameItem = (originalList: OrderItem[], toBeSelectedItems: OrderItem[]) => {
        //a new list to hold changed items
        const newList = [...originalList];
        let found = false;
        //recursively merge children first
        for(let i=0; i < newList.length; i++) {
            const item = newList[i];
            if(item.Modifiers && item.Modifiers.length) {
                const newModifiers = mergeSameItem(item.Modifiers, toBeSelectedItems)
                if(newModifiers) {
                    //something merged in the modifiers
                    found = true;
                    item.Modifiers = newModifiers;
                }
            }
        }

        //merge current list
        //loop though the list, look for similar item
        //both item needs to be removed, a new item needs to be added
        for(let i=0; i < newList.length; i++) {
            const item1 = newList[i];
            let newItem: OrderItem | null = null;
            //should the newItem be selected
            let isSelected = false;
            let newSelectedItems = [...toBeSelectedItems];
            //start looking from next item on, items before i should all be merged
            for(let j=i+1; j < newList.length; j++) {
                const item2 = newList[j];
                if(compareItem(item1, item2)) {
                    found = true;
                    //update new item amount
                    const newAmount = (item1.amount?item1.amount:0) + (item2.amount?item2.amount:0);
                    if(!newItem) {
                        newItem = {
                            ...item1,
                            amount: newAmount
                        }
                        //replace item1 with new item
                        newList[i] = newItem;
                    } else {
                        newItem.amount = newAmount;
                    }
                    //remove item2 from newList
                    newList.splice(j, 1);
                    j--;

                    //if item1 or item2 is selected, new item needs to be selected
                    for(let x=0; x<newSelectedItems.length; x++) {
                        const selectedItem = newSelectedItems[x];
                        if(selectedItem === item1) {
                            //remove and replace
                            newSelectedItems.splice(x, 1);
                            isSelected= true;
                        } else if (selectedItem === item2) {
                            //remove
                            newSelectedItems.splice(x, 1);
                            isSelected = true;
                        }
                    }
                }
            }

            
            if(newItem && isSelected) {
                //one of merged item is selected, make the newItem selected
                newSelectedItems.push(newItem);
                setSelectedItems(newSelectedItems);
            }
        }

        if(found) {
            return newList;
        } else {
            return false;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const orderItem = (itemData: any) => {
        //copy old items into a new list
        let newOrderItemsList: OrderItem[] = [];
        if(order.OrderItems) {
            newOrderItemsList = [...order.OrderItems];
        }

        //create the new item and push it into new list
        let orderItem = {itemData, status: "NEW", amount: 1};
        newOrderItemsList.push(orderItem);

        //select the new item
        setSelectedItems([orderItem]);

        //try merge all items
        const mergedList = mergeSameItem(newOrderItemsList, [orderItem]);
        if(mergedList) newOrderItemsList = mergedList;

        //update the order
        setOrder({
            ...order,
            //new orderItems have a status of NEW, it must be changed to OPEN before sending to the server
            OrderItems: newOrderItemsList
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const orderModifier = (itemData: any) => {
        let orderItems: false | OrderItem[] | undefined = order.OrderItems;
        const newSelectedItems: OrderItem[] = [];
        for(const selectedItem of selectedItems) {
            //check if last replacement was successful
            if(orderItems) {
                const newModifier = {itemData, status: "NEW", amount: 1};
                //copy selectedItem and place newModifer in it's Modifiers list
                const newItem = {...selectedItem, Modifiers: [...(selectedItem.Modifiers || []), newModifier]}
                orderItems = replaceItem(orderItems, selectedItem, newItem);
                if(orderItems) {
                    newSelectedItems.push(newItem);
                }
            } else {
                break;
            }
        }

        if(orderItems) {
            setSelectedItems(newSelectedItems);

            //try merge all items
            const mergedList = mergeSameItem(orderItems, newSelectedItems);
            if(mergedList) orderItems = mergedList;

            //if replacement was successful, update order
            setOrder({
                ...order,
                OrderItems: orderItems
            });
        }
    }

    const createButton = (buttonData: any, key: any) => {
        return (
            <Button key={key} onClick={() => {
                let script:string = buttonData.Script.data.script;
                let parameters = buttonData.parameters;
                
                if(parameters) {
                    //put the parameters in
                    for(const key in parameters) {
                        script = script.replace(`%${key}%`, parameters[key].toString());
                    }
                }

                //execute the script
                // eslint-disable-next-line no-eval
                eval(script);
            }}>{buttonData.buttonName}</Button>
        );
    }

    const handleError = (err: Error) => {
        console.error(err);
        //TODO: properly handle errors
    }

    useEffect(() => {
        const queryButtons = (menuId, setButtons) => {
            axios.post("/api/menu/get", {id: menuId, options: {
                include: {
                    association: "Buttons",
                    include: "Script"
                }
            }}).then(result => {
                setButtons(result.data.Buttons);
            }).catch(handleError);
        }
    
        queryButtons(1, setMainButtons);
        queryButtons(2, setSideButtons);

        //TODO: rewrite this query to include acutal token
        axios.post("/api/order/get", {
            "userId": 1,
            "hash": "DEVELOPMENT_TOKEN",
            "orderId": 1,
            "options": {
                "include": [{
                    association: "OrderItems",
                    include: [{
                        association: "Modifiers"
                    }]
                }]
            }
        }).then(result => {
            setOrder(result.data);
        });
        
    }, [setMainButtons, setSideButtons, setOrder])

    return (
        <Container fluid id="order-page-container">
            <Panel id="order-page-side-menu" className="d-flex flex-column">
                <PanelHeader className="order-page-panel-header">Side Menu</PanelHeader>
                <PanelBody className="flex-grow-1 overflow-auto">
                    {sideButtons.map((button, index) => {
                        return createButton(button, index);
                    })}
                </PanelBody>
            </Panel>
            <Panel id="order-page-main-menu" className="d-flex flex-column">
                <PanelHeader className="order-page-panel-header">Main Menu</PanelHeader>
                <PanelBody className="flex-grow-1 overflow-auto">
                    {mainButtons.map((button, index) => {
                        return createButton(button, index);
                    })}
                </PanelBody>
            </Panel>
            <Panel id="order-page-receipt-preview" className="d-flex flex-column">
                <PanelHeader className="order-page-panel-header">Items</PanelHeader>
                <PanelBody className="flex-grow-1 overflow-auto">
                    <OrderItemDisplay order={order} selectedItems={selectedItems} setSelectedItems={setSelectedItems}/>
                </PanelBody>
                <div style={{
                    marginTop: "5px",
                    marginBottom: "5px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap:"3px"
                }}>
                    <Button themeColor={Color.fire_red}>Exit</Button>
                    <Button>+</Button>
                    <Button>-</Button>
                    <Button themeColor={Color.kiwi_green}>Send</Button>
                </div>
            </Panel>
        </Container>
    );
}