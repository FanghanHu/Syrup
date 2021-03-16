import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Container, Table } from "react-bootstrap";
import { useHistory } from "react-router";
import Button from "../../components/button";
import CheckLoginToken from "../../components/check-login-token";
import LabeledTextInput from "../../components/labeled-text-input";
import NumberPad from "../../components/number-pad";
import OrderItemDisplay from "../../components/order-item-display";
import Panel from "../../components/panel";
import PanelBody from "../../components/panel-body";
import PanelHeader from "../../components/panel-header";
import SimpleToast from "../../components/simple-toast";
import VerticalCenter from "../../components/vertical-center";
import { useLoginToken } from "../../contexts/login-context";
import { useOrder, useSetOrder } from "../../contexts/order-context";
import { Color } from "../../util/Color";
import { Status } from "../../util/helpers";
import "./style.css";

export default function Payment() {
    CheckLoginToken();

    const [amount, setAmount] = useState("");
    const [paymentList, setPaymentList] = useState<any[]>([]);

    const order = useOrder();
    const setOrder = useSetOrder();
    const history = useHistory();
    const loginToken = useLoginToken();
    const [message, setMessage] = useState("");

    const getAmountDue = (payments = paymentList) => {
        const total = order?.cache?.total;
        if(total) {
            let totalPaid = 0;
            for(const payment of payments) {
                totalPaid += payment.amount;
            }
            return total - totalPaid;
        }
        
        return NaN;
    }

    const createPaymentListItem = (payment, key) => {
        const date = new Date(payment.createdAt);
        return (
            <tr key={key} style={{
                textDecoration: payment.status === Status.VOIDED?"line-through":"none"
            }}>
                <td>{payment.type}</td>
                <td>{payment.amount}</td>
                <td>
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
        );
    }

    let isPaying = false;
    const pay = async (paymentType) => {
        //TODO: handle payment and updating of order status on server with a transaction and lock.
        if(!isPaying) {
            try{
                isPaying = true;
                const amountNum = parseFloat(amount);
                setAmount("0");

                if(amountNum > 0) {
                    await axios.post("/api/payment/create", {
                        userId: loginToken.userId,
                        hash: loginToken.hash,
                        data: {
                            amount: amountNum,
                            type: paymentType,
                            status: "PAID",
                            ServerId: loginToken.userId,
                            OrderId: order.id
                        }
                    });
                    //update payment list
                    const result = await loadPayments();
                    //update order status
                    const amountDue = getAmountDue(result.data);
                    setPaymentList(result.data);
                    const newOrder = {...order};
                    if(amountDue <= 0) {
                        //change order to paid
                        newOrder.status = "PAID";
                    } else {
                        //change order to open
                        newOrder.status = "OPEN";
                    }
                    setOrder(newOrder);
                    const data:any = {
                        userId: loginToken.userId,
                        hash: loginToken.hash,
                        orderId: order.id,
                        status: newOrder.status
                    }
                    await axios.post('/api/order/update-meta', data);
                } else {
                    setMessage("You must input a valid amount.")
                }
            } catch (err) {
                console.error(err);
                setMessage(err.stack);
            } finally {
                isPaying = false;
            }
        }
    }

    const loadPayments = () => {
        return axios.post("/api/payment/list", {
            options: {
                where: {
                    OrderId: order.id
                }
            }
        });
    }

    useEffect(() => {
        loadPayments().then(results => {
            setPaymentList(results.data);
        }).catch(err => {
            console.error(err);
            setMessage(err.stack);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container fluid className="vh-100 position-relative py-3">
            <VerticalCenter>
                <Panel className="d-flex flex-column mx-auto" 
                    style={{
                        width: "fit-content",
                        height: "fit-content",
                        overflow:"overlay"
                    }}>
                    <PanelHeader>
                        Payment
                    </PanelHeader>
                    <div className="payment-page-grid">
                        <PanelBody className="h-100">
                            <OrderItemDisplay order={order}/>
                        </PanelBody>
                        <PanelBody className="h-100 d-flex flex-column">
                            <div style={{
                                fontSize: "1.2em",
                                fontWeight: 600,
                                textAlign: "center"
                            }}>
                                Amount Due: ${getAmountDue().toFixed(2)}
                            </div>
                            <div className="flex-grow-1">
                                <Table striped bordered hover className="h-100 text-center">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Amount</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentList.map((payment,index) => createPaymentListItem(payment, index))}
                                    </tbody>
                                </Table>
                            </div>
                        </PanelBody>
                        <PanelBody className="h-100 payment-page-controll">
                            <div className="d-flex flex-column h-100 justify-content-between">
                                <div>
                                    <LabeledTextInput 
                                        className="my-3"
                                        title="Amount:" 
                                        value={amount}
                                        onChange={(e) => {setAmount(e.target.value)}}
                                    />
                                    <NumberPad text={amount} setText={setAmount} onEnter={() => {pay("Cash")}}/>
                                </div>
                                <div className="d-flex flex-row-reverse mt-3">
                                    <Button className="m-1" themeColor={Color.gray} style={{width: "4em"}}
                                        onClick={() => {
                                            history.push("/main-menu");
                                        }}
                                    >Exit</Button>
                                    <Button className="m-1" themeColor={Color.kiwi_green} style={{width: "4em"}}
                                        onClick={() => {
                                            pay("Cash");
                                        }}
                                    >Cash</Button>
                                    <Button className="m-1" themeColor={Color.dark_gold} style={{width: "4em"}}
                                        onClick={() => {
                                            pay("Card");
                                        }}
                                    >Card</Button>
                                </div>
                            </div>
                        </PanelBody>
                    </div>
                </Panel>
                <SimpleToast title="Message:" message={message} setMessage={setMessage}/>
            </VerticalCenter>
        </Container>
    );
}