import axios from "axios";
import React, { CSSProperties } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router";
import Button from "../../components/button";
import LabeledTextInput from "../../components/labeled-text-input";
import Panel from "../../components/panel";
import PanelBody from "../../components/panel-body";
import PanelHeader from "../../components/panel-header";
import SimpleToast from "../../components/simple-toast";
import { useLoginToken } from "../../contexts/login-context";
import { Color } from "../../util/Color";
import ListPropertiesLayout from "./list-properties-layout";

export default function UserSetup() {
    const [userId, setUserId] = useState(0);
    const [fullName, setFullName] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userList, setUserList] = useState<any[]>([]);

    const [filter, setFilter] = useState("");
    const [message, setMessage] = useState("");
    const history = useHistory();
    const loginToken = useLoginToken();

    const labelStyle:CSSProperties = {
        width: "6em",
        textAlign: "center",
        whiteSpace: "nowrap"
    }

    const updateUserList = () => {
        //get a list of all users
        axios.post("/api/user/list").then(result => {
            const users = result.data;
            setUserList(users);
        }).catch(err => {
            console.error(err);
            setMessage(err.response.data);
        })
    }

    const displayUserData = (userData: any) => {
        setUserId(userData.id || 0);
        setFullName(userData.fullName || "");
        setAccessCode(userData.accessCode || "");
        setUsername(userData.username || "");
        setPassword(userData.password?"********":"");
    }

    useEffect(() => {
        updateUserList();
    }, [])

    return (
        <Container className="vh-100 position-relative py-3">
            <Panel className="w-100 h-100 d-flex flex-column">
                <PanelHeader>
                    User Setup
                </PanelHeader>
                <ListPropertiesLayout>
                    <div className="d-flex flex-column h-100">
                        <LabeledTextInput className="m-1" title="Filter" value={filter} labelColorTheme={Color.gold}
                            onChange={(e) => {setFilter(e.target.value)}} labelStyle={{width: "5em", textAlign: "center"}}/>
                        <PanelBody className="flex-grow-1 overflow-auto" style={{flexBasis: 0}}>
                            {userList.map(user => <Button
                                key={user.id}
                                className="w-100"
                                themeColor={user.id===userId?Color.kiwi_green:Color.gray}
                                style={{
                                    marginBottom: "3px",
                                    display: filter?(user.fullName as string).toLowerCase().includes(filter.toLocaleLowerCase())?"block":"none":"block"
                                }}
                                onClick={() => {
                                    displayUserData(user);
                                }}
                            >{user.fullName}</Button>)}
                        </PanelBody>
                    </div>
                    <div className="d-flex flex-column h-100">
                        <PanelBody className="flex-grow-1">
                            <LabeledTextInput className="m-1" title="Full Name" value={fullName} labelStyle={labelStyle}
                            onChange={(e) => {setFullName(e.target.value)}}/>
                            <LabeledTextInput className="m-1" title="Access Code" value={accessCode} labelStyle={labelStyle}
                            onChange={(e) => {setAccessCode(e.target.value)}}/>
                            <LabeledTextInput className="m-1" title="Username" value={username} labelStyle={labelStyle}
                            onChange={(e) => {setUsername(e.target.value)}}/>
                            <LabeledTextInput className="m-1" title="Password" value={password} labelStyle={labelStyle}
                            onChange={(e) => {setPassword(e.target.value)}} inputProps={{type: "password"}}/>
                        </PanelBody>
                        <div className="d-flex flex-row-reverse">
                            <Button className="m-1" style={{fontSize: "1.2em", width:"4em"}} themeColor={Color.gray}
                                onClick={() => {
                                    history.goBack();
                                }}
                            >Exit</Button>
                            <Button className="m-1" style={{fontSize: "1.2em", width:"4em"}} themeColor={Color.kiwi_green}
                                onClick={() => {
                                    if(!fullName) {
                                        //validate username
                                        setMessage("User must have a name.");
                                        return;
                                    }

                                    if(userId) {
                                        //update user
                                        axios.post("/api/user/update", {
                                            userId: loginToken.userId,
                                            hash: loginToken.hash,
                                            data: {
                                                id: userId,
                                                fullName: fullName?fullName:undefined,
                                                accessCode: accessCode?accessCode:undefined,
                                                username: username?username:undefined,
                                                password: password?password:undefined
                                            }
                                        }).then(result => {
                                            setMessage("User Data Saved.");
                                            updateUserList();
                                        }).catch(err => {
                                            setMessage(err.response.data);
                                        })
                                    } else {
                                        //create new user
                                        axios.post("/api/user/create", {
                                            userId: loginToken.userId,
                                            hash: loginToken.hash,
                                            data: {
                                                fullName: fullName?fullName:undefined,
                                                accessCode: accessCode?accessCode:undefined,
                                                username: username?username:undefined,
                                                password: password?password:undefined
                                            }
                                        }).then(result => {
                                            setMessage("User created.");
                                            updateUserList();
                                            displayUserData(result.data);
                                        }).catch(err => {
                                            setMessage(err.response.data);
                                        })
                                    }
                                }}
                            >Save</Button>
                            <Button className="m-1" style={{fontSize: "1.2em", width:"4em"}} themeColor={Color.dark_gold}
                                onClick={() => {
                                    displayUserData({});
                                }}
                            >Add</Button>
                        </div>
                    </div>
                </ListPropertiesLayout>
            </Panel>
            <SimpleToast title="Message:" message={message} setMessage={setMessage}/>
        </Container>
    );
}