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
        //TODO:
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
                    <Table striped bordered hover className="h-100">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Type</th>
                                <th>Table</th>
                                <th>Customer</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
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