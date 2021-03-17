import React, { useState } from "react";
import { Container } from "react-bootstrap";
import PanelHeader from "../../components/panel-header";
import Panel from "../../components/panel";
import ListPropertiesLayout from "../setup/list-properties-layout";
import PanelBody from "../../components/panel-body";
import Button from "../../components/button";
import { useHistory } from "react-router-dom";
import { useOrder, useSetOrder } from "../../contexts/order-context";
import { Color } from "../../util/Color";
import axios from "axios";
import { useEffect } from "react";
import SimpleToast from "../../components/simple-toast";
import CheckLoginToken from "../../components/check-login-token";

export default function TableSelection() {
    CheckLoginToken();

    const [tableAreaList, setTableAreaList] = useState<any[]>([]);
    const [tableList, setTableList] = useState<any[]>([]);
    const [selectedTable, setSelectedTable] = useState<any|null>(null);
    const [selectedTableArea, setSelectedTableArea] = useState<any|null>(null);

    const [message, setMessage] = useState("");
    const history = useHistory();
    const order = useOrder();
    const setOrder = useSetOrder();

    const createTableAreaListItem = (tableArea, key) => {
        return (
            <Button
                key={"area-" + key}
                style={{
                    marginBottom: "5px",
                    width: "100%"
                }}
                themeColor={selectedTableArea===tableArea?Color.kiwi_green:Color.sky_blue}
                onClick={() => {
                    setSelectedTableArea(tableArea);
                    setTableList(tableArea.Tables);
                    setSelectedTable(null);
                }}
            >
                {tableArea.tableAreaName}
            </Button>
        )
    }

    const createTableListItem = (table, key) => {
        return (
            <Button
                key={"table-"+key} 
                style={{
                    position: "absolute",
                    left: table.x,
                    top: table.y,
                    minWidth: "4em",
                    minHeight: "2em"
                }}
                onClick={() => {
                    setSelectedTable(table);
                }}
                themeColor={selectedTable===table?Color.kiwi_green:Color.sky_blue}
            >
                {table.tableName}
            </Button>
        )
    }

    const goToOrder = () => {
        //check if a table is selected, and attach it to order, then go to order page
        if(selectedTable) {
            const newOrder = {
                ...order,
                Table: selectedTable
            };
            setOrder(newOrder);
            history.push("/order");
        } else {
            setMessage("You must select a table before ordering")
        }
    }

    const loadAreas = () => {
        axios.post("/api/table-area/list", {
            options: {
                include: ["Tables"]
            }
        }).then((result)=> {
            setTableAreaList(result.data);
            const tableArea = result.data[0];
            if(tableArea && tableArea.id) {
                //load tables for the first table area
                setSelectedTableArea(tableArea);
                setTableList(tableArea.Tables);
                setSelectedTable(null);
            }
        })
    }

    useEffect(() => {
        loadAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container className="vh-100 position-relative py-3">
            <Panel className="w-100 h-100 d-flex flex-column">
                <PanelHeader>
                    Tables
                </PanelHeader>
                <ListPropertiesLayout>
                    <PanelBody>
                        {tableAreaList.map((tableArea, index) => createTableAreaListItem(tableArea, index))}
                    </PanelBody>
                    <div className="d-flex flex-column h-100">
                        <PanelBody className="flex-grow-1 position-relative">
                            {tableList.map((table, index) => createTableListItem(table, index))}
                        </PanelBody>
                        <div className="d-flex flex-row-reverse">
                            <Button style={{width:"4em", margin:"3px"}} themeColor={Color.gray}
                                onClick={() => {
                                    history.goBack();
                                }}
                            >Exit</Button>
                            <Button style={{width:"4em", margin:"3px"}} themeColor={Color.kiwi_green} onClick={goToOrder}>Order</Button>
                        </div>
                    </div>
                </ListPropertiesLayout>
            </Panel>
            <SimpleToast title="Message:" message={message} setMessage={setMessage}/>
        </Container>
    );
}