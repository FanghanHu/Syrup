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
import { useOrder } from "../../contexts/order-context";

export default function Order() {
    const [mainButtons, setMainButtons] = useState([]);
    const [sideButtons, setSideButtons] = useState([]);

    const order = useOrder();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const test = () => {
        console.log("test!");
    }

    const createButton = (buttonData, key) => {
        return (
            <Button key={key} onClick={() => {
                // eslint-disable-next-line no-eval
                eval(buttonData.Script.data.script)
            }}>{buttonData.buttonName}</Button>
        );
    }

    const handleError = (err: Error) => {
        console.error(err);
        //TODO: handle it!
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
    }, [setMainButtons, setSideButtons])

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