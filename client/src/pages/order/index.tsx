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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const orderItem = (itemData: any) => {
        let orderItems: OrderItem[] = [];
        if(order.OrderItems) {
            orderItems = [...order.OrderItems];
        }
        let orderItem = {itemData, status: "NEW"};
        orderItems.push(orderItem);
        setSelectedItems([orderItem]);
        setOrder({
            ...order,
            //new orderItems have a status of NEW, it must be changed to OPEN before sending to the server
            OrderItems: orderItems
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const orderModifier = (itemData: any) => {
        let orderItems: false | OrderItem[] | undefined = order.OrderItems;
        const newSelectedItem: OrderItem[] = [];
        for(const selectedItem of selectedItems) {
            //check if last replacement was successful
            if(orderItems) {
                const newModifier = {itemData, status: "NEW"};
                //copy selectedItem and place newModifer in it's Modifiers list
                const newItem = {...selectedItem, Modifiers: [...(selectedItem.Modifiers || []), newModifier]}
                orderItems = replaceItem(orderItems, selectedItem, newItem);
                if(orderItems) {
                    newSelectedItem.push(newItem);
                }
            } else {
                break;
            }
        }

        if(orderItems) {
            //if replacement was successful, update order
            setOrder({
                ...order,
                OrderItems: orderItems
            });
            setSelectedItems(newSelectedItem);
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