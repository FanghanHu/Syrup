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

export default function Order() {
    const [mainButtons, setMainButtons] = useState([]);
    const [sideButtons, setSideButtons] = useState([]);

    const order = useOrder();
    const setOrder = useSetOrder();

    //TODO: function to orderItem, voidItem, decreaseAmount, increaseAmount, SendOrder.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const orderItem = (itemData: any) => {
        let orderItems: OrderItem[] = [];
        if(order.OrderItems) {
            orderItems = [...order.OrderItems];
        }
        orderItems.push({itemData, status: "NEW"});
        setOrder({
            ...order,
            //new orderItems have a status of NEW, it must be changed to OPEN before sending to the server
            OrderItems: orderItems
        })
    }

    const createButton = (buttonData: any, key: any) => {
        return (
            <Button key={key} onClick={() => {
                // eslint-disable-next-line no-eval
                eval(buttonData.Script.data.script)
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
                    <OrderItemDisplay order={order}/>
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