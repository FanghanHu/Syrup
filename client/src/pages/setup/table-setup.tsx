import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router";
import Button from "../../components/button";
import Panel from "../../components/panel";
import PanelBody from "../../components/panel-body";
import PanelHeader from "../../components/panel-header";
import { Color } from "../../util/Color";

export default function TableSetup() {

    const [tableAreaList, setTableAreaList] = useState<any[]>([]);
    const [tableList, setTableList] = useState<any[]>([]);
    const [selectedTable, setSelectedTable] = useState<any|null>(null);
    const [selectedTableArea, setSelectedTableArea] = useState<any|null>(null);

    const history = useHistory();

    const createTableButton = (table, key) => {
        return (
            <Button key={"table-"+key} 
                style={{
                    position: "absolute",
                    left: table.x,
                    top: table.y,
                    minWidth: "4em",
                    minHeight: "2em"
                }}
                draggable="true"
                onDragStart={(e) => {
                    e.dataTransfer.setData("tableIndex", tableList.indexOf(table) + "");
                    e.dataTransfer.setData("startX", e.clientX + "");
                    e.dataTransfer.setData("startY", e.clientY + "");
                }}
                onClick={() => {
                    setSelectedTable(table);
                }}
                themeColor={selectedTable===table?Color.kiwi_green:Color.sky_blue}
            >
                {selectedTable===table?<span
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                        //change table name on exiting edit mode
                        const newName = (e.target as any).innerText;
                        if(newName) {
                            const newTable = {
                                ...table,
                                tableName: newName,
                                status: "NEW"
                            };
                            updateTable(table, newTable);
                            setSelectedTable(newTable);
                        } else {
                            //reset tableName if a new Name is not provided
                            (e.target as any).innerText = table.tableName;
                        }
                    }}
                >{table.tableName}</span>:table.tableName}
            </Button>
        )
    }

    const createTableAreaButton = (tableArea, key) => {
        return (
            <Button key={"table-area-"+key}
                style={{
                    width: "100%"
                }}
                onClick={() => {
                    setSelectedTableArea(tableArea)
                    fetchTableList(tableArea.id);
                }}
                themeColor={selectedTableArea===tableArea?Color.kiwi_green:Color.sky_blue}
            >
                {tableArea.tableAreaName}
            </Button>
        )
    }

    const fetchTableList = (tableAreaId) => {
        axios.post("/api/table/list", {
            options: {
                where: {
                    TableAreaId: tableAreaId
                }
            }
        }).then(res => {
            setTableList(res.data);
        })
    }

    const updateTable = (targetTable, newTable) => {
        const newTableList:any[] = [...tableList];
        for(let i=0; i<tableList.length; i++) {
            const originalTable = tableList[i];
            if(originalTable === targetTable) {
                newTableList[i] = newTable;
                setTableList(newTableList);
                return;
            }
        }
    }

    useEffect(() => {
        //load list of table areas
        axios.post("/api/table-area/list").then((result)=> {
            setTableAreaList(result.data);
            const tableArea = result.data[0];
            if(tableArea && tableArea.id) {
                //load tables for the first table area
                setSelectedTableArea(tableArea);
                fetchTableList(tableArea.id);
            }
        })
        
    }, [setTableAreaList, setTableList])

    return (
        <Container className="vh-100 py-3">
            <Panel className="w-100 h-100 d-flex flex-column">
                <PanelHeader>
                    Table Setup
                </PanelHeader>
                <div className="table-setup-grid">
                    <PanelBody
                        onDragOver={(e) => {
                            //TODO: prevent user from moving table outside the edge of the frame
                            let isInside = true;

                            if(isInside) {
                                //allow drag
                                e.preventDefault();
                                e.dataTransfer.dropEffect = "move";
                            }
                        }}
                        onDrop={(e) => {
                            const table = tableList[parseInt(e.dataTransfer.getData("tableIndex"))];
                            const startX = parseInt(e.dataTransfer.getData("startX"));
                            const startY = parseInt(e.dataTransfer.getData("startY"));
                            const newTable = {
                                ...table,
                                x: table.x + e.clientX - startX,
                                y: table.y + e.clientY - startY,
                                status: "NEW"
                            }
                            updateTable(table, newTable);
                        }}
                    >
                        {tableList.map((table, index) => createTableButton(table, index))}
                    </PanelBody>
                    <div className="w-100 h-100 d-flex flex-column">
                        <PanelBody className="flex-grow-1 overflow-auto" style={{flexBasis: 0}}>
                            {tableAreaList.map((tableArea, index) => createTableAreaButton(tableArea, index))}
                        </PanelBody>
                        <div className="setup-button-group">
                            <Button themeColor={Color.kiwi_green} onClick={() => {
                                const newTable = {
                                    tableAreaId: selectedTableArea.id,
                                    tableName: "new table",
                                    x: 50,
                                    y: 50,
                                    status: "NEW"
                                };
                                setTableList([...tableList, newTable]);
                                setSelectedTable(newTable);
                            }}>Add Table</Button>

                            <Button themeColor={Color.kiwi_green} onClick={() => {
                                //TODO: save tables and tableAreas
                            }}>Save</Button>

                            <Button themeColor={Color.fire_red} onClick={() => {
                                history.goBack();
                            }}>Exit</Button>
                        </div>
                    </div>
                </div>
            </Panel>
        </Container>
    );
}