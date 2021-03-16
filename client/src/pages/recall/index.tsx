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

    const createOrderListItem = (orderArg, key) => {
        const date = new Date(orderArg.createdAt);
        return (
            <tr key={"order-" + key}
                onClick={() => {
                    if(order===orderArg) {
                        //click on the same order to open it
                        history.push("/order");
                    } else {
                        //set selected order
                        setOrder(orderArg);
                    }
                }}
                style={order===orderArg?{
                    background: "darkGray",
                    color: "white"
                }:{}}
            >
                <td>{orderArg.orderNumber}</td>
                <td>{orderArg.type}</td>
                <td>{orderArg?.Table?.tableName}</td>
                <td>{orderArg?.Customers?.map(customer => {
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
                <td>${orderArg?.cache?.total}</td>
                <td
                    style ={{
                        //make paid status appear as green
                        color: orderArg?.status==="PAID"?"green":"inherit"
                    }}
                >
                    {orderArg?.status}
                </td>
                <td>
                    {
                        date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        })
                    } - 
                    {
                        date.toLocaleTimeString('en-US', {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })
                    }
                </td>
            </tr>
        )
    }

    useEffect(() => {
        loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                <th>Status</th>
                                <th>Time</th>
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
                    <Button className="m-1" themeColor={Color.kiwi_green}
                        onClick={() => {
                            history.push("/order");
                        }}
                    >Open</Button>
                </div>
            </Panel>
            <SimpleToast title="Message:" message={message} setMessage={setMessage}/>
        </Container>
    );
}