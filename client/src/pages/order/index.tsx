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
import { deepEqual } from "../../util/helpers";
import { useLoginToken } from "../../contexts/login-context";
import CheckLoginToken from "../../components/check-login-token";
import { useHistory } from "react-router";
import React from "react";
import SimpleToast from "../../components/simple-toast";
import { OrderModel } from "../../util/price-calculation";

export default function Order() {
    CheckLoginToken();

    const [mainButtons, setMainButtons] = useState([]);
    const [sideButtons, setSideButtons] = useState([]);
    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);

    const order = useOrder();
    const setOrder = useSetOrder();
    const loginToken = useLoginToken();
    const history = useHistory();
    const [message, setMessage] = useState("");

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


    const insertModifier = (modifier: OrderItem, orderItems: OrderItem[], targetItems:OrderItem[]) => {
        //make a copy of orderItems
        const newOrderItems: OrderItem[] = [...orderItems];
        //stores newly created items, which needs to be selected at the end
        let itemsToSelect: OrderItem[] = [];
        //stores whatever target is left, will be modified during the process
        let targets = [...targetItems];
        //if a target is found within these orderItems and their modifers
        let found = false;
        //loop through all orderItems
        for(let i = 0; i < newOrderItems.length; i++) {
            const orderItem = newOrderItems[i];
            if(orderItem.Modifiers && orderItem.amount) {
                const result = insertModifier(modifier, orderItem.Modifiers, targets);
                if(result) {
                    //at least one of the children is a target, 
                    found = true;
                    const {newModifiers, newItemsToSelect, newTargets} = result;
                    //replace the orderItem
                    const newOrderItem = {
                        ...orderItem,
                        Modifiers: newModifiers,
                        amount:  Math.min(orderItem.amount, 1),
                        id: orderItem.amount>1?undefined:orderItem.id,
                        status: "NEW"
                    }
                    newOrderItems.splice(i, 1, newOrderItem);
                    //set new targets
                    targets = newTargets;
                    //add new items to selection
                    itemsToSelect = itemsToSelect.concat(newItemsToSelect);
                    if(orderItem.amount > 1) {
                        //if orderitem amount is bigger than one, make a new item that holds the rest of the amount, 
                        //and insert it before newOrderItem
                        const replacement = {
                            ...orderItem,
                            amount: orderItem.amount - 1,
                            status: "NEW"
                        }
                        newOrderItems.splice(i, 0, replacement);
                        i++;
                    }
                }
            }

            //check if each orderItem is a target
            for(let j=0; j<targets.length; j++) {
                const target = targets[j];
                if(orderItem === target && orderItem.amount) {
                    //mark this round of search as found
                    found = true;
                    //found a target, remove it from list
                    targets.splice(j, 1);
                    //make a replacement item, replace the original item
                    const newOrderItem = {
                        ...orderItem,
                        Modifiers: [...(orderItem.Modifiers?orderItem.Modifiers:[]), modifier],
                        amount: Math.min(orderItem.amount, 1),
                        id: orderItem.amount>1?undefined:orderItem.id,
                        status: "NEW"
                    }
                    newOrderItems.splice(i, 1, newOrderItem);
                    //mark the new item to be selected
                    itemsToSelect.push(newOrderItem);
                    if(orderItem.amount > 1) {
                        //if orderitem amount is bigger than one, make a new item that holds the rest of the amount, 
                        //and insert it before newOrderItem
                        const replacement = {
                            ...orderItem,
                            amount: orderItem.amount - 1,
                            status: "NEW"
                        }
                        newOrderItems.splice(i, 0, replacement);
                        i++;
                    }
                }
            }
        }

        if(found) {
            return {
                newModifiers: newOrderItems,
                newItemsToSelect: itemsToSelect,
                newTargets: targets
            }
        } else {
            return false;
        }
    }


    /**
     * Merge all the same item inside the list together
     * Also merges same modifier
     * 
     * Already ordered items will not be merged because they have a different id
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

    /**
     * Order an item as modifier for the selected items,
     * If any selected item have an amount of more than 1, it is split into 2 items, 
     * one part will have 1 amount, 
     * and the other part will have the rest.
     * The part with 1 amount will be selected.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const orderModifier = (itemData: any) => {
        const result = insertModifier({itemData, amount: 1, status:"NEW"}, order.OrderItems || [], selectedItems);
        if(result) {
            const newItemsToSelect = result.newItemsToSelect;
            let newModifiers = result.newModifiers;
            
            setSelectedItems(newItemsToSelect);

            //try merge all items
            const mergedList = mergeSameItem(newModifiers, newItemsToSelect);
            if(mergedList) newModifiers = mergedList;

            setOrder({
                ...order,
                OrderItems: newModifiers
            });
        }
    }

    let sendingOrder = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sendOrder = async () => {
        //to prevent user from sending the same order multiple times
        if(!sendingOrder) {
            try {
                sendingOrder = true;

                //get all NEW orderItems
                let orderItems = order.OrderItems?.filter(orderItem => orderItem.status === "NEW");
                let orderId = order.id;

                if(!order.id) {
                    //if order is new, create order first.
                    const result = await axios.post('/api/order/create/', {
                        userId: loginToken.userId,
                        hash: loginToken.hash,
                        type: order.type
                    });

                    orderId = result.data.id;
                }

                //update order meta (customers, table)

                const data:any = {
                    userId: loginToken.userId,
                    hash: loginToken.hash,
                    orderId: orderId
                }
                if(order.Customers) {
                    data.customers = order.Customers;
                }
                if(order.Table) {
                    data.table = order.Table;
                }
                const orderModel = new OrderModel(order);
                data.cache = orderModel.total;

                await axios.post('/api/order/update-meta', data);

                //set orderId for all new OrderItems.
                if(orderItems && orderItems.length) {
                    for(const orderItem of orderItems) {
                        orderItem.OrderId = orderId;
                    }
                }

                //edit the order
                const result = await axios.post("/api/order/edit-items", {
                    userId: loginToken.userId,
                    hash: loginToken.hash,
                    orderId: orderId,
                    OrderItems: orderItems
                });

                setOrder(result.data);
                setMessage("Order sent!");
                sendingOrder = false;
                return true;
            } catch (err) {
                console.error(err);
                setMessage(err.stack);
            } finally {
                sendingOrder = false;
            }
        } else {
            setMessage("Order already sent, waiting for server response.");
        }
        return false;
    }

    const createButton = (buttonData: any, key: any) => {
        return (
            <Button key={key} onClick={() => {
                let script:string = buttonData.Script.data.script;
                let parameters = buttonData.parameters;
                
                if(parameters) {
                    //put the parameters in
                    for(const key in parameters) {
                        script = script.replace(`%${key}%`, JSON.stringify(parameters[key]));
                    }
                }

                //execute the script
                // eslint-disable-next-line no-eval
                eval(script);
            }}>{buttonData.buttonName}</Button>
        );
    }

    const queryButtons = (menuId, setButtons) => {
        axios.post("/api/menu/get", {data: {id: menuId}, options: {
            include: {
                association: "Buttons",
                include: "Script"
            }
        }}).then(result => {
            setButtons(result.data.Buttons);
        }).catch(err => {
            setMessage("failed to get buttons");
        });
    }

    const changeMainMenu = (menuId) => {
        queryButtons(menuId, setMainButtons);
    }

    const changeSideMenu = (menuId) => {
        queryButtons(menuId, setSideButtons);
    }

    useEffect(() => {
        //update order
        if(order.id) {
            axios.post("/api/order/get", {
                userId: loginToken.userId,
                hash: loginToken.hash,
                orderId: order.id,
                options: {
                    include: ["Table", "Customers", "OrderItems"]
                }
            }).then(results => {
                setOrder(results.data);
            }).catch(err => {
                console.error(err);
                setMessage(err.stack);
            }) 
        }
    
        //load both side menu and main menu, using default menuId 1 and 2
        changeMainMenu(1);
        changeSideMenu(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap:"3px"
                }}>
                    <Button themeColor={Color.kiwi_green} onClick={async () => {
                        if(await sendOrder()) {
                            history.push('/main-menu');
                        }
                    }}>Send</Button>
                    <Button themeColor={Color.dark_gold} onClick={async () => {
                        if(await sendOrder()) {
                            history.push('/payment');
                        }
                    }}>Pay</Button>
                    <Button themeColor={Color.gray} onClick={() => {
                        history.push('/main-menu');
                    }}>Exit</Button>
                </div>
            </Panel>
            <SimpleToast title="Message:" message={message} setMessage={setMessage}/>
        </Container>
    );
}