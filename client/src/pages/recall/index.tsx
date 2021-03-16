import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Button from "../../components/button";
import CheckLoginToken from "../../components/check-login-token";
import Panel from "../../components/panel";
import PanelBody from "../../components/panel-body";
import PanelHeader from "../../components/panel-header";
import SimpleToast from "../../components/simple-toast";
import { useLoginToken } from "../../contexts/login-context";
import { useOrder, useSetOrder } from "../../contexts/order-context";
import { Color } from "../../util/Color";

export default function Recall() {
    CheckLoginToken();

    const [orderList, setOrderList] = useState<any[]>([]);

    const [message, setMessage] = useState("");
    const history = useHistory();
    const order = useOrder();
    const setOrder = useSetOrder();
    const loginToken = useLoginToken();

    const loadOrders = () => {
        axios.post("/api/order/list", {
            userId: loginToken.userId,
            hash: loginToken.hash,
            options: {
                include: ["Table", "Customers"]
            }
        }).then(results => {
            setOrderList(results.data);
        }).catch(err => {
            console.error(err);
            setMessage(err.stack);
        }) 
    }

    const createOrderListItem = (order, key) => {
        return (
            <tr key={"order-" + key}>
                <td>{order.orderNumber}</td>
                <td>{order.type}</td>
                <td>{order?.Table?.tableName}</td>
                <td>{order?.Customers?.map(customer => {
                    let displayName = customer.firstName?customer.firstName:"";
                    if(customer.lastName) {
                        if(customer.firstName) {
                            displayName += " "
                        }
                        displayName += customer.lastName;
                    }
                    if(customer.phone) {
                        if(displayName) {
                            displayName += " - ";
                        }
                        displayName += customer.phone;
                    }
            
                    if(!displayName) {
                        displayName = "Unnamed Customer";
                    }
                    return displayName;
                }).join(", ")}</td>
                <td>${order?.cache?.total}</td>
            </tr>
        )
    }

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <Container className="vh-100 position-relative py-3">
            <Panel className="w-100 h-100 d-flex flex-column">
                <PanelHeader>
                    Recall
                </PanelHeader>
                <PanelBody className="flex-grow-1 overflow-auto" style={{flexBasis: 0}}>
                    <Table striped bordered hover className="h-100 text-center">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Type</th>
                                <th>Table</th>
                                <th>Customer</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderList.map((order, index) => createOrderListItem(order, index))}
                        </tbody>
                    </Table>
                </PanelBody>
                <div className="d-flex flex-row-reverse">
                    <Button className="m-1" themeColor={Color.gray}
                        onClick={() => {
                            history.goBack();
                        }}
                    >Exit</Button>
                </div>
            </Panel>
            <SimpleToast title="Message:" message={message} setMessage={setMessage}/>
        </Container>
    );
}