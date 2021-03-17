import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Button from "../../../components/button";
import InputGroup from "../../../components/input-group";
import Label from "../../../components/label";
import LabelBar from "../../../components/label-bar";
import LabeledTextInput from "../../../components/labeled-text-input";
import Panel from "../../../components/panel";
import PanelBody from "../../../components/panel-body";
import PanelHeader from "../../../components/panel-header";
import SimpleToast from "../../../components/simple-toast";
import { useLoginToken } from "../../../contexts/login-context";
import { Color } from "../../../util/Color";
import { findAndReplace, Status } from "../../../util/helpers";

export default function MenuSetup() {
    const [menuList, setMenuList] =  useState<any[]>([]);
    const [buttonList, setButtonList] =  useState<any[]>([]);
    const [scriptList, setScriptList] =  useState<any[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<any|null>(null);
    const [selectedButton, setSelectedButton] = useState<any|null>(null);
    const [selectedScript, setSelectedScript] = useState<any|null>(null);
    const [menuId, setMenuId] = useState<number|null>(null);

    const loginToken = useLoginToken();
    const history = useHistory();
    const [message, setMessage] = useState("");

    const loadButtonsFromMenu = (menuId) => {
        if(menuId) {
            axios.post("/api/button/list", {options: {
                where: {MenuId: menuId}
            }}).then(result => {
                setButtonList(result.data);
                selectButton(result.data[0])
            })
        } else {
            setButtonList([]);
            selectButton(null);
        }
    }
    const loadMenuList = () => {
        axios.post("/api/menu/list").then(result => {
            setMenuList(result.data);
            setSelectedMenu(result.data[0]);
        });
    }

    const loadScriptList = () => {
        axios.post("/api/script/list").then(result => {
            setScriptList(result.data);
            setSelectedScript(result.data[0]);
        });
    }

    const updateButton = (targetButton, newButton) => {
        const newbuttonList = findAndReplace(buttonList, targetButton, newButton);
        if(newbuttonList) {
            setButtonList(newbuttonList);
            selectButton(newButton);
        }
    }

    const renderScriptUI = () => {
        if(selectedScript) {
            const uiList:any = [];
            for(const key in selectedScript.data.parameters) {
                const description = selectedScript.data.parameters[key]
                switch(key) {
                    case "itemData":
                        //create parameter on button
                        if(selectedButton) {
                            uiList.push(
                                <div key={"ui-" + uiList.length}>
                                    <LabelBar themeColor={Color.dark_gold} className="mt-3" >{description}</LabelBar>
                                    <LabeledTextInput title="Name:" 
                                        style={{marginTop: "5px"}}
                                        value={selectedButton?.parameters?.itemData?.itemName || ""} 
                                        onChange={(e) => {
                                            const newButton = {
                                                ...selectedButton,
                                                buttonName: e.target.value,
                                                parameters: {
                                                    ...selectedButton?.parameters,
                                                    itemData: {
                                                        ...selectedButton?.parameters?.itemData,
                                                        itemName: e.target.value
                                                    }
                                                },
                                                status: Status.NEW
                                            };
                                            updateButton(selectedButton, newButton);
                                        }
                                    }/>
                                    <LabeledTextInput title="Price:" 
                                        style={{marginTop: "5px"}}
                                        value={selectedButton?.parameters?.itemData?.price || ""} 
                                        onChange={(e) => {
                                            const newButton = {
                                                ...selectedButton,
                                                parameters: {
                                                    ...selectedButton?.parameters,
                                                    itemData: {
                                                        ...selectedButton?.parameters?.itemData,
                                                        price: e.target.value
                                                    }
                                                },
                                                status: Status.NEW
                                            };
                                            updateButton(selectedButton, newButton);
                                        }
                                    }/>
                                    <LabeledTextInput title="Tax Rate:" 
                                        style={{marginTop: "5px"}}
                                        value={selectedButton?.parameters?.itemData?.tax || ""} 
                                        onChange={(e) => {
                                            const newButton = {
                                                ...selectedButton,
                                                parameters: {
                                                    ...selectedButton?.parameters,
                                                    itemData: {
                                                        ...selectedButton?.parameters?.itemData,
                                                        tax: e.target.value
                                                    }
                                                },
                                                status: Status.NEW
                                            };
                                            updateButton(selectedButton, newButton);
                                        }
                                    }/>
                                </div>
                            );
                        }
                        break;
                    case "menuId":
                        uiList.push(
                            <div key={"ui-" + uiList.length}>
                                <LabelBar themeColor={Color.dark_gold} className="mt-3" >{description}</LabelBar>
                                <InputGroup className="mt-3">
                                    <Label style={{
                                        width: "4em",
                                        textAlign: "center"
                                    }}>Script</Label>
                                    <select 
                                        value={selectedButton?.parameters?.menuId || 0}
                                        style={{
                                            flexGrow:1,
                                            border: "none",
                                            boxShadow: "inset 0 2px 4px gray",
                                            width: "10px"
                                        }}
                                        onChange={(e) => {
                                            const id = parseInt(e.target.value);
                                            const menuName = e.target.options[e.target.selectedIndex].text;
                                            if(id) {
                                                const newButton = {
                                                    ...selectedButton,
                                                    parameters: {
                                                        ...selectedButton?.parameters,
                                                        menuId: id
                                                    },
                                                    status: Status.NEW,
                                                    buttonName: menuName
                                                };
                                                updateButton(selectedButton, newButton);
                                            } else {
                                                setMessage("You need to save the menu first.");
                                            }
                                        }}
                                    >
                                        <option value={0}>Please select a Menu</option>
                                        {menuList.map((menu, index) => <option value={menu.id} key={"menu-" + index}>{menu.menuName}</option>)}
                                    </select>
                                </InputGroup>
                            </div>
                        );
                    break;
                    default: 
                    //TODO: handle unknown script parameters
                }
            }
            return uiList;
        }

        return null;
    }

    const handleScriptChange = (e) => {
        const script = scriptList.filter(script => parseInt(e.target.value) === script.id)[0];
        setSelectedScript(script);

        if(selectedButton && script) {
            //update script for the selected button
            const newButton = {
                ...selectedButton,
                ScriptId: script.id,
                status: Status.NEW
            }
            updateButton(selectedButton, newButton);
        }
    }

    const createScripListItem = (script, key) => {
        return (
            <option key={"script-" + key} value={key}>
                {script.scriptName}
            </option>
        )
    }

    const selectButton = (button) => {
        setSelectedButton(button);

        if(button) {
            if(button.ScriptId) {
                //update selected script
                for(const script of scriptList) {
                    if(script.id === button.ScriptId) {
                        //select the button's script
                        setSelectedScript(script);
                        break;
                    }
                }
            } else {
                setSelectedScript(null);
            }
        }
    }

    const createButtonListItem = (button, key) => {
        if(button.status === Status.DELETED) {
            return null;
        }

        return (
            <Button key={"button-" + key}
                style={{
                    width: "100%",
                    marginBottom: "6px",
                    minHeight: "2em"
                }}
                onClick={() => {selectButton(button)}}
                themeColor={selectedButton===button?Color.kiwi_green:Color.sky_blue}
            >
                {button.buttonName}
            </Button>
        )
    }
    const addButton = () => {
        const newButton = {
            buttonName: "New Button",
            status: Status.NEW
        };
        const newButtonList = [...buttonList, newButton];
        setButtonList(newButtonList);
        selectButton(newButton);
    }
    const deleteButton = () => {
        if(selectedButton) {
            if(selectedButton.id) {
                //existing table, mark for deletion
                const newButton = {
                    ...selectedButton,
                    status: Status.DELETED
                }
                const newButtonList = findAndReplace(buttonList, selectedButton, newButton);
                if(newButtonList) {
                    setButtonList(newButtonList);

                }
            } else {
                //new table, just remove from list
                const newButtonList = findAndReplace(buttonList, selectedButton);
                if(newButtonList) {
                    setButtonList(newButtonList);
                }
            }
            selectButton(null);
        }
    }
    const selectMenu = (menu, newMenuList = menuList) => {
        if(buttonList && buttonList.length) {
            //there are buttons that needs saving
            //create a replacement for pervious selected menu
            const replacementMenu = {
                ...selectedMenu,
                Buttons: buttonList
            }

            const replacementMenuList = findAndReplace(newMenuList, selectedMenu, replacementMenu);
            if(replacementMenuList) {
                setMenuList(replacementMenuList);
                setSelectedMenu(replacementMenu);
            }
        } else if (newMenuList !== menuList) {
            //no button to save, but list needs to be updated, (add or remove menu)
            setMenuList(newMenuList);
        }

        if(selectedMenu !== menu) {
            //selected menu needs to be changed
            if(menu.Buttons) {
                //use saved buttons if possible
                setButtonList(menu.Buttons);
                selectButton(menu.Buttons[0]);
            } else {
                //load buttons from db
                loadButtonsFromMenu(menu.id);
            }
            setSelectedMenu(menu);
        }
    }
    const createMenuListItem = (menu, key) => {
        if(menu.status === Status.DELETED) {
            return null;
        }
        return (
            <Button key={"menu-" + key}
                style={{
                    width: "100%",
                    marginBottom: "6px",
                    minHeight: "2em"
                }}
                onClick={() => {selectMenu(menu)}}
                themeColor={selectedMenu===menu?Color.kiwi_green:Color.sky_blue}
            >
                {
                    selectedMenu === menu ? <span
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => {
                            //change table name on exiting edit mode
                            const newName = (e.target as any).innerText;
                            if(newName) {
                                const newMenu = {
                                    ...menu,
                                    menuName: newName,
                                    status: Status.NEW
                                };
                                const newMenuList = findAndReplace(menuList, selectedMenu, newMenu);
                                if(newMenuList) {
                                    setMenuList(newMenuList);
                                    setSelectedMenu(newMenu);
                                }
                            } else {
                                //reset name if a new Name is not provided
                                (e.target as any).innerText = menu.menuName;
                            }
                        }}
                    >
                    {menu.menuName}</span>:menu.menuName
                }
            </Button>
        )
    }
    const addMenu = () => {
        const newMenu = {
            menuName: "New Menu",
            status: Status.NEW
        }
        const newMenuList = [...menuList, newMenu];
        selectMenu(newMenu, newMenuList);
    }
    const deleteMenu = () => {
        if(selectedMenu) {
            if(selectedMenu.id) {
                //existing menu, mark for deletion
                const newMenu = {
                    ...selectedMenu,
                    status: Status.DELETED
                }
                const newMenuList = findAndReplace(menuList, selectedMenu, newMenu);
                if(newMenuList) {
                    setMenuList(newMenuList);
                }
            } else {
                //new menu, just remove from list
                const newMenuList = findAndReplace(menuList, selectedMenu);
                if(newMenuList) {
                    setMenuList(newMenuList);
                }
            }
            setSelectedMenu(null);
            setButtonList([]);
            selectButton(null)
        }
    }

    const saveMenu = async (argMenu, argButtons) => {
        const menu = {...argMenu};
        const buttons = argButtons&&argButtons.length?[...argButtons]:[];

        if(menu.status === Status.DELETED && menu.id) {
            // deleting exiting menu
            await axios.post("/api/menu/delete", {
                userId: loginToken.userId,
                hash: loginToken.hash,
                data: {
                    id: menu.id
                }
            });
        } else {
            if(menu.status === Status.NEW) {
                if(menu.id) {
                    // update menu
                    await axios.post("/api/menu/update", {
                        userId: loginToken.userId,
                        hash: loginToken.hash,
                        data: {
                            id: menu.id,
                            menuName: menu.menuName
                        }
                    });
                } else {
                    // create menu
                    const result = await axios.post("/api/menu/create", {
                        userId: loginToken.userId,
                        hash: loginToken.hash,
                        data: {
                            menuName: menu.menuName
                        }
                    });
                    menu.id = result.data.id;
                }
            }

            //only processing buttons if the menu isn't deleted, because menu delete will cascade to button
            //so no point updating a button that's going to be deleted anyways
            for(const button of buttons) {
                if(button.status === Status.DELETED && button.id) {
                    //delete menu
                    await axios.post("/api/button/delete", {
                        userId: loginToken.userId,
                        hash: loginToken.hash,
                        data: {
                            id: button.id
                        }
                    });
                } else if(button.status === Status.NEW) {
                    //only process buttons that's marked new
                    if(button.id) {
                        //update button
                        await axios.post("/api/button/update", {
                            userId: loginToken.userId,
                            hash: loginToken.hash,
                            data: {
                                id: button.id,
                                MenuId: menu.id,
                                ScriptId: button.ScriptId,
                                buttonName: button.buttonName,
                                translations: button.translations,
                                parameters: button.parameters
                            }
                        });
                    } else {
                        //create button
                        await axios.post("/api/button/create", {
                            userId: loginToken.userId,
                            hash: loginToken.hash,
                            data: {
                                MenuId: menu.id,
                                ScriptId: button.ScriptId,
                                buttonName: button.buttonName,
                                translations: button.translations,
                                parameters: button.parameters
                            }
                        });
                    }
                }
            }
        }
    }

    let savingData = false;
    const save = async () => {
        if(!savingData) {
            savingData = true;
            try {
                for(const menu of menuList) {
                    if(menu === selectedMenu) {
                        //selected menu, save current button list
                        await saveMenu(menu, buttonList);
                    } else {
                        //unselected menu, save stored buttons
                        await saveMenu(menu, menu.Buttons);
                    }

                    setMessage("changes saved!");
                    //reload all the menus and buttons
                    loadMenuList();
                    loadButtonsFromMenu(1);
                }
            } catch (err) {
                setMessage(err.stack);
            } finally {
                savingData = false;
            }
        } else {
            setMessage("Working... Please Wait.");
        }
    }

    const exit = () => {
        history.goBack();
    }

    useEffect(() => {
        loadMenuList();
        //load main menu
        loadButtonsFromMenu(1);
        loadScriptList();
    }, []);

    return (
        <Container className="vh-100 py-3">
            <Panel className="w-100 h-100 d-flex flex-column">
                <PanelHeader>
                    Menu Setup
                </PanelHeader>
                <div className="menu-setup-grid">
                    <div className="d-flex flex-column h-100">
                        <PanelBody className="menu-list">
                            {menuList.map((menu, index) => createMenuListItem(menu, index))}
                        </PanelBody>
                        <PanelBody className="button-list">
                            {buttonList.map((button, index) => createButtonListItem(button, index))}
                        </PanelBody>
                    </div>
                    <div className="d-flex flex-column h-100">
                        <PanelBody style={{flexBasis: 0, flexGrow: 1}}>
                            <InputGroup>
                                <Label style={{
                                    width: "4em",
                                    textAlign: "center"
                                }}>Script</Label>
                                <select 
                                    value={selectedScript?selectedScript.id:0}
                                    style={{
                                        flexGrow:1,
                                        border: "none",
                                        boxShadow: "inset 0 2px 4px gray",
                                        width: "10px"
                                    }}
                                    onChange={handleScriptChange}
                                >
                                    <option value={0}>Please select a script</option>
                                    {scriptList.map((script) => createScripListItem(script, script.id))}
                                </select>
                            </InputGroup>
                            {renderScriptUI()}
                        </PanelBody>
                        <div className="menu-setup-buttons">
                            <Button themeColor={Color.dark_gold} onClick={addButton}>Add Button</Button>
                            <Button themeColor={Color.fire_red} onClick={deleteButton}>Delete Button</Button>
                            <Button themeColor={Color.dark_gold} onClick={addMenu}>Add Menu</Button>
                            <Button themeColor={Color.fire_red} onClick={deleteMenu}>Delete Menu</Button>
                            <Button themeColor={Color.kiwi_green} onClick={save}>Save</Button>
                            <Button themeColor={Color.gray} onClick={exit}>Exit</Button>
                        </div>
                    </div>
                </div>
            </Panel>
            <SimpleToast title="Message:" message={message} setMessage={setMessage}/>
        </Container>
    );
}