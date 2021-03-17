import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Button from "../components/button";
import LabeledTextInput from "../components/labeled-text-input";
import Panel from "../components/panel";
import PanelBody from "../components/panel-body";
import PanelHeader from "../components/panel-header";
import SimpleToast from "../components/simple-toast";
import { Color } from "../util/Color";

export default function Report() {
    const [fromTime, setFromTime] = useState(new Date().toLocaleDateString() + " 00:00:00");
    const [toTime, setToTime] = useState(new Date().toLocaleDateString() + " 23:59:59");
    const [reportData, setReportData] = useState<any>({});

    const [message, setMessage] = useState("");
    const history = useHistory();

    let isWorking = false;
    const getReport = async () => {
        if(!isWorking) {
            isWorking = true;
            try{
                const fromTimeStr = new Date(fromTime).toJSON();
                const toTimeStr = new Date(toTime).toJSON();
                console.log(fromTimeStr);
                const result = await axios.post("/api/report/settlement", {
                    fromTime: fromTimeStr,
                    toTime: toTimeStr
                });
                setReportData(result.data);
                setMessage("");
            } catch (err) {
                console.error(err);
                setMessage(err.stack);
            } finally {
                isWorking = false;
            }
        } else {
            setMessage("Working, please wait...");
        }
    }

    useEffect(() => {
        getReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sectionHeaderStyle = {
        marginTop: "1em"
    }
    
    return (
        <Container className="vh-100 position-relative py-3">
            <Panel className="w-100 h-100 d-flex flex-column">
                <PanelHeader>
                    Reports
                </PanelHeader>
                <PanelBody className="flex-grow-1 overflow-auto" style={{flexBasis: 0}}>
                    Reports from:
                    <h5>{reportData.fromTime?new Date(reportData.fromTime).toLocaleString():""} to {reportData.toTime?new Date(reportData.toTime).toLocaleString():""}</h5>
                    <hr/>

                    <h5 style={sectionHeaderStyle}>Settlement</h5>
                    <hr/>
                    <div>Subtotal: ${reportData.subtotal?.toFixed(2)}</div>
                    <div>Tax: ${reportData.tax?.toFixed(2)}</div>
                    <div className="font-weight-bold">Total: ${reportData.total?.toFixed(2)}</div>

                    <h5 style={sectionHeaderStyle}>Payments</h5>
                    <hr/>
                    <div>Cash: ${reportData.cash?.toFixed(2)}</div>
                    <div>Card: ${reportData.card?.toFixed(2)}</div>
                    <br/>
                    <div className="font-weight-bold">Total: ${(reportData.cash + reportData.card)?.toFixed(2)}</div>
                    <h5 style={sectionHeaderStyle}>Orders</h5>
                    <hr/>
                    <div>Dine In Orders: {reportData.dineInCount}</div>
                    <div>To Go Orders: {reportData.toGoCount}</div>
                    <div>Delivery Orders: {reportData.deliverCount}</div>
                    <div>Pick up Orders: {reportData.pickupCount}</div>
                    <br/>
                    <div className="font-weight-bold">Total Orders: {reportData.orderCount}</div>
                </PanelBody>
                <div className="d-flex flex-wrap justify-content-center">
                    <LabeledTextInput className="m-1" title="From:" value={fromTime} style={{width:"14em"}}
                        onChange={(e) => {setFromTime(e.target.value)}}/>
                    <LabeledTextInput className="m-1" title="To:" value={toTime} style={{width:"14em"}}
                        onChange={(e) => {setToTime(e.target.value)}}/>
                    <Button className="m-1" themeColor={Color.kiwi_green} style={{width:"6em"}}
                        onClick={() => {
                            getReport();
                        }}
                    >Get Report</Button>
                    <Button className="m-1" themeColor={Color.gray} style={{width:"6em"}}
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