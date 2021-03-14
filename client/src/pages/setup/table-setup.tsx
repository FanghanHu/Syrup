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
import SimpleToast from "../../components/simple-toast";
import { useLoginToken } from "../../contexts/login-context";
import { Color } from "../../util/Color";
import { findAndReplace } from "../../util/helpers";

export default function TableSetup() {

    const [tableAreaList, setTableAreaList] = useState<any[]>([]);
    const [tableList, setTableList] = useState<any[]>([]);
    const [selectedTable, setSelectedTable] = useState<any|null>(null);
    const [selectedTableArea, setSelectedTableArea] = useState<any|null>(null);

    const loginToken = useLoginToken();
    const history = useHistory();
    const [message, setMessage] = useState("");

    const createTableButton = (table, key) => {
        if(table.status === "DELETED") {
            return null;
        }

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

    const switchSelectedTableArea = (newArea, newTableAreaList = tableAreaList) => {
        if(tableList && tableList.length) {
            //selectedArea has tables that need saving
            //create a replacement for selectedArea
            const newTableArea = {
                ...selectedTableArea,
                Tables: tableList
            }
            //create a replacement list and replace it.
            const replacementTableAreaList = findAndReplace(newTableAreaList, selectedTableArea, newTableArea);
            if(replacementTableAreaList) {
                setTableAreaList(replacementTableAreaList);
            }
        }

        if(selectedTableArea !== newArea) {
            //only do stuff when newArea is actually a different area.
            if(newArea.Tables) {
                setTableList(newArea.Tables);
            } else {
                fetchTableList(newArea.id);
            }
            setSelectedTableArea(newArea);
        }
    } 

    const createTableAreaButton = (tableArea, key) => {
        if(tableArea.status === "DELETED") {
            return null;
        }

        return (
            <Button key={"table-area-"+key}
                style={{
                    width: "100%",
                    margin: "3px",
                    minHeight: "2em"
                }}
                onClick={() => {switchSelectedTableArea(tableArea)}}
                themeColor={selectedTableArea===tableArea?Color.kiwi_green:Color.sky_blue}
            >
                {selectedTableArea===tableArea?<span
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                        //change table name on exiting edit mode
                        const newName = (e.target as any).innerText;
                        if(newName) {
                            const newTableArea = {
                                ...tableArea,
                                tableAreaName: newName,
                                status: "NEW"
                            };
                            const newTableAreaList = findAndReplace(tableAreaList, selectedTableArea, newTableArea);
                            if(newTableAreaList) {
                                setTableAreaList(newTableAreaList);
                                setSelectedTableArea(newTableArea);
                            }
                        } else {
                            //reset tableName if a new Name is not provided
                            (e.target as any).innerText = tableArea.tableAreaName;
                        }
                    }}
                >{tableArea.tableAreaName}</span>:tableArea.tableAreaName}
            </Button>
        )
    }

    const fetchTableList = (tableAreaId) => {
        if(tableAreaId) {
            axios.post("/api/table/list", {
                options: {
                    where: {
                        TableAreaId: tableAreaId
                    }
                }
            }).then(res => {
                setTableList(res.data);
                setSelectedTable(null);
            })
        } else {
            setTableList([]);
            setSelectedTable(null);
        }
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

    const createNewTable = () => {
        const newTable = {
            tableName: "new table",
            x: 50,
            y: 50,
            status: "NEW"
        };
        setTableList([...tableList, newTable]);
        setSelectedTable(newTable);
    }

    /**
     * 
     * @param tableArea will be inserted into the db if there isn't a id
     * @param tables tables that relates to the given table area
     */
    const saveData = async (tableAreaArg, tablesArg) => {
        const tableArea = {...tableAreaArg};
        const tables = tablesArg&&tablesArg.length?[...tablesArg]:[];

        if(tableArea.status === "DELETED" && tableArea.id) {
            //delete tableArea
            await axios.post('/api/table-area/delete', {
                userId: loginToken.userId,
                hash: loginToken.hash,
                data: {
                    id: tableArea.id
                }
            });
        } else {
            if (tableArea.status === "NEW") {
                if(tableArea.id) {
                    //update tableArea
                    await axios.post("/api/table-area/update", {
                        userId: loginToken.userId,
                        hash: loginToken.hash,
                        data: {
                            id: tableArea.id,
                            tableAreaName: tableArea.tableAreaName
                        }
                    });
                } else {
                    //create tableArea
                    const result = await axios.post("/api/table-area/create", {
                        userId: loginToken.userId,
                        hash: loginToken.hash,
                        data: {
                            tableAreaName: tableArea.tableAreaName
                        }
                    });
                    tableArea.id = result.data.id;
                }
            }

            //create or update tables
            for(const table of tables) {
                if(table.status === "DELETED" && table.id) {
                    //delete table
                    await axios.post("/api/table/delete", {
                        userId: loginToken.userId,
                        hash: loginToken.hash,
                        data: {
                            id: table.id,
                        }
                    });
                } else if(table.status === "NEW") {
                    //update or create table
                    if(table.id) {
                        //update table
                        await axios.post("/api/table/update", {
                            userId: loginToken.userId,
                            hash: loginToken.hash,
                            data: {
                                id: table.id,
                                tableName: table.tableName,
                                x: table.x,
                                y: table.y,
                                icon: table.icon,
                                TableAreaId: tableArea.id
                            }
                        });
                    } else {
                        //create table
                        await axios.post("/api/table/create", {
                            userId: loginToken.userId,
                            hash: loginToken.hash,
                            data: {
                                tableName: table.tableName,
                                x: table.x,
                                y: table.y,
                                icon: table.icon,
                                TableAreaId: tableArea.id
                            }
                        });
                    }
                }
            }
        }
    }

    let savingData = false;
    const saveChanges = async () => {
        if(!savingData) {
            savingData = true;
            try {
                for(const tableArea of tableAreaList) {
                    if(tableArea === selectedTableArea) {
                        //selected area, use current tables
                        await saveData(tableArea, tableList);
                    } else {
                        //background area, used stored tables
                        await saveData(tableArea, tableArea.Tables);
                    }
                }
                await axios.post("/api/table-area/list").then((result)=> {
                    setTableAreaList(result.data);
                    const tableArea = result.data[0];
                    if(tableArea && tableArea.id) {
                        //load tables for the first table area
                        setSelectedTableArea(tableArea);
                        fetchTableList(tableArea.id);
                    }
                });
                setMessage("Table and Area data saved.");
            } catch (err) {
                setMessage(err.stack);
            } finally {
                savingData = false;
            }
        } else {
            setMessage("Working... Please Wait.");
        }
    }

    const deleteTable = () => {
        if(selectedTable) {
            if(selectedTable.id) {
                //existing table, mark for deletion
                const newTable = {
                    ...selectedTable,
                    status: "DELETED"
                }
                updateTable(selectedTable, newTable);
                setSelectedTable(null);
            } else {
                //new table, just remove from list
                const newTableList = findAndReplace(tableList, selectedTable);
                if(newTableList) {
                    setTableList(newTableList);
                    setSelectedTable(null);
                }
            }
        }
    }

    const createNewTableArea = () => {
        const newTableArea = {
            tableAreaName: "new area",
            status: "NEW"
        };
        const newTableAreaList = [...tableAreaList, newTableArea];
        switchSelectedTableArea(newTableArea, newTableAreaList);
    }

    const deleteTableArea = () => {
        if(selectedTableArea) {
            if(selectedTableArea.id) {
                //existing table area, mark for deletion
                const newTableArea = {
                    ...selectedTableArea,
                    status: "DELETED"
                }
                const newTableAreaList = findAndReplace(tableAreaList, selectedTableArea, newTableArea);
                if(newTableAreaList) {
                    setTableAreaList(newTableAreaList);
                    setSelectedTableArea(null);
                }
            } else {
                //new table area, just remove from list
                const newTableAreaList = findAndReplace(tableAreaList, selectedTableArea);
                if(newTableAreaList) {
                    setTableAreaList(newTableAreaList);
                    setSelectedTableArea(null);
                }
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
                            <Button themeColor={Color.dark_gold} onClick={createNewTableArea}>Add Area</Button>
                            <Button themeColor={Color.fire_red} onClick={deleteTableArea}>Delete Area</Button>
                            <Button themeColor={Color.kiwi_green} onClick={saveChanges}>Save</Button>
                            <Button themeColor={Color.dark_gold} onClick={createNewTable}>Add Table</Button>
                            <Button themeColor={Color.fire_red} onClick={deleteTable}>Delete Table</Button>
                            <Button themeColor={Color.gray} onClick={() => {
                                history.goBack();
                            }}>Exit</Button>
                        </div>
                    </div>
                </div>
            </Panel>
            <SimpleToast title="Message:" message={message} setMessage={setMessage}/>
        </Container>
    );
}