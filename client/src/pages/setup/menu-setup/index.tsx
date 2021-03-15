import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Button from "../../../components/button";
import InputGroup from "../../../components/input-group";
import Label from "../../../components/label";
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

    const loginToken = useLoginToken();
    const history = useHistory();
    const [message, setMessage] = useState("");

    const loadButtonsFromMenu = (menuId) => {
        if(menuId) {
            axios.post("/api/button/list", {options: {
                where: {MenuId: menuId}
            }}).then(result => {
                setButtonList(result.data);
            })
        } else {
            setButtonList([]);
        }
    }
    const loadMenuList = () => {
        axios.post("/api/menu/list").then(result => {
            setMenuList(result.data);
            setSelectedMenu(result.data[0]);
        });
    }
    const handleScriptChange = (e) => {
        //TODO:
    }

    const selectButton = (button) => {
        setSelectedButton(button);
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
            setSelectedButton(null);
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
        }
    }
    const save = () => {
        //TODO:
    }
    const exit = () => {
        history.goBack();
    }

    useEffect(() => {
        loadMenuList();
        //load main menu
        loadButtonsFromMenu(1);
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
                                    style={{
                                        flexGrow:1,
                                        border: "none",
                                        boxShadow: "inset 0 2px 4px gray",
                                        width: "10px"
                                    }}
                                    onChange={handleScriptChange}
                                >
                                    {
                                        //TODO: load all scripts
                                    }
                                </select>
                            </InputGroup>
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