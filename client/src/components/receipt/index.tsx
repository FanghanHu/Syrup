import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Order } from "../../util/models";
import OrderItemDisplay from "../order-item-display";
import "./style.css";

declare const window: any;

export default function Receipt(props) {
    const params:any = useParams();
    const orderId = params.orderId;

    const [order, setOrder] = useState<Order>({});
    const [companyInfo, setCompanyInfo] = useState<any>({});

    useEffect(() => {
        if(orderId) {
            axios.post("/api/order/get", {
                orderId: orderId,
                options: {
                    include: ["Table", "Customers", "OrderItems"]
                }
            }).then(results => {
                setOrder(results.data);
                //set a global variable so server page can tell when the page is loaded when printing.
                setTimeout(() => {
                    window.receiptLoaded = true;
                }, 1);
            }).catch(err => {
                console.error(err);
                //set a global variable so server page can tell when the page is loaded when printing.
                setTimeout(() => {
                    window.receiptLoaded = true;
                }, 1);
            });
        }

        axios.post("/api/config/get-company-info").then(results => {
            setCompanyInfo(results.data);
        }).catch(err => {
            console.error(err);
        });
    }, [orderId]);

    return (
        <div id="receipt" className="receipt">
                <div className="text-center">
                    <div className="company-name">{companyInfo.name}</div>
                    <div className="company-address">{companyInfo.address}</div>
                    <div className="company-address">{companyInfo.city}, {companyInfo.state}, {companyInfo.zip}</div>
                    <div className="company-address">{companyInfo.phone}</div>
                    <div className="order-number mb-3">
                        Order: {order.orderNumber}
                    </div>
                    <hr/>
                </div>
                <OrderItemDisplay order={order}/>
            </div>
    )
}