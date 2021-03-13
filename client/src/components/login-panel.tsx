import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import Button from './button';
import InputGroup from '../components/input-group';
import Label from '../components/label';
import NumberPad from '../components/number-pad';
import Panel from '../components/panel';
import PanelBody from '../components/panel-body';
import PanelHeader from '../components/panel-header';
import TextInput from '../components/text-input';
import { useSetLoginToken } from '../contexts/login-context';
import { Color } from '../util/Color';
import SimpleToast from './simple-toast';

export default function LoginPanel({onLogin}) {

    const setLoginToken = useSetLoginToken();
    const [accessCode, setAccessCode] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const loginWithAccessCode = function() {
        axios.post("/api/login/accessCode", {
            accessCode
        }).then(res => {
            setLoginToken(res.data);
            onLogin();
        }).catch(err => {
            setLoginToken({});
            setMessage(err.response.data);
        });
    };

    const loginWithPassword = function() {
        axios.post("/api/login/password", {
            username, password
        }).then(res => {
            setLoginToken(res.data);
            onLogin();
        }).catch(err => {
            setLoginToken({});
            setMessage(err.response.data);
        });
    };

    
    return (
        <div className="d-flex flex-column justify-content-center vh-100 vw-100" style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 100
        }}>
            <Panel className="mx-auto" style={{maxWidth:"350px"}}>
                <PanelHeader>
                    Login
                </PanelHeader>
                <PanelBody>
                    <Tab.Container defaultActiveKey="accessCode">
                        <Nav className="justify-content-center">
                            <Nav.Item>
                                <Nav.Link className="pb-2" eventKey="accessCode"><Button>AccessCode</Button></Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className="pb-2" eventKey="password"><Button>Password</Button></Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="accessCode">
                                <InputGroup>
                                    <Label>Access Code:</Label>
                                    <TextInput value={accessCode} onChange={(e)=>{setAccessCode(e.target.value)} }></TextInput>
                                </InputGroup>
                                <NumberPad className="mt-2" text={accessCode} setText={setAccessCode} onEnter={loginWithAccessCode}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="password">
                                <InputGroup className="my-2">
                                    <Label>Username:</Label>
                                    <TextInput value={username} onChange={(e)=>{setUsername(e.target.value)} }></TextInput>
                                </InputGroup>
                                <InputGroup className="my-2">
                                    <Label>Password:</Label>
                                    <TextInput type="password" value={password} 
                                    onChange={(e)=>{setPassword(e.target.value)}}
                                    onKeyDown={(e) => {
                                        if(e.key === "Enter") {
                                            loginWithPassword();
                                        }
                                    }}
                                    ></TextInput>
                                </InputGroup>
                                <div className="d-flex justify-content-end">
                                    <Button themeColor={Color.gold} onClick={loginWithPassword}>Login</Button>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </PanelBody>
            </Panel>
            <SimpleToast title="Message:" message={message} setMessage={setMessage}/>
        </div>
    );
}