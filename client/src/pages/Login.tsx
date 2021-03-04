import React from 'react';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import InputGroup from '../components/input-group';
import KeyboardButton from '../components/keybord-button';
import Label from '../components/label';
import NumberPad from '../components/number-pad';
import Panel from '../components/panel';
import PanelBody from '../components/panel-body';
import PanelHeader from '../components/panel-header';
import TextInput from '../components/text-input';
import { useLogin, useSetLogin } from '../contexts/login-context';

export default function Login(): JSX.Element {
    const loginToken = useLogin();
    const setLoginToken = useSetLogin();

    const [accessCode, setAccessCode] = useState("");

    return (
        <Container fluid>
            <div className="d-flex flex-column justify-content-center vh-100">
                <Panel className="mx-auto" style={{maxWidth:"500px"}}>
                    <PanelHeader>
                        Login
                    </PanelHeader>
                    <PanelBody>
                        <InputGroup>
                            <Label>Access Code:</Label>
                            <TextInput></TextInput>
                        </InputGroup>
                        <NumberPad text={accessCode} setText={setAccessCode}/>
                    </PanelBody>
                </Panel>
            </div>
        </Container>
    );
}