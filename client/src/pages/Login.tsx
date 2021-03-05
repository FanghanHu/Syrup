import React from 'react';
import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Button from '../components/button';
import InputGroup from '../components/input-group';
import Label from '../components/label';
import NumberPad from '../components/number-pad';
import Panel from '../components/panel';
import PanelBody from '../components/panel-body';
import PanelHeader from '../components/panel-header';
import TextInput from '../components/text-input';
import { useLogin, useSetLogin } from '../contexts/login-context';
import { Color } from '../util/Color';

export default function Login(): JSX.Element {

    const [accessCode, setAccessCode] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginWithAccessCode = function() {

    };

    return (
        <Container fluid>
            <div className="d-flex flex-column justify-content-center vh-100">
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
                                    <Nav.Link className="pb-2" eventKey="backOffice"><Button>Back Office</Button></Nav.Link>
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
                                <Tab.Pane eventKey="backOffice">
                                    <InputGroup className="my-2">
                                        <Label>Username:</Label>
                                        <TextInput value={username} onChange={(e)=>{setUsername(e.target.value)} }></TextInput>
                                    </InputGroup>
                                    <InputGroup className="my-2">
                                        <Label>Password:</Label>
                                        <TextInput type="password" value={password} onChange={(e)=>{setPassword(e.target.value)} }></TextInput>
                                    </InputGroup>
                                    <div className="d-flex justify-content-end">
                                        <Button themeColor={Color.gold}>Login</Button>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </PanelBody>
                </Panel>
            </div>
        </Container>
    );
}