import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import InputGroup from '../components/InputGroup';
import KeyboardButton from '../components/KeyboardButton';
import Label from '../components/Label';
import Panel from '../components/Panel';
import PanelBody from '../components/PanelBody';
import PanelHeader from '../components/PanelHeader';
import TextInput from '../components/TextInput';

export default function Login(): JSX.Element {
    return (
        <Container fluid>
            <div className="d-flex flex-column justify-content-center vh-100">
                <Panel className="w-100 mx-auto" style={{maxWidth:"500px"}}>
                    <PanelHeader>
                        Login
                    </PanelHeader>
                    <PanelBody>
                        <InputGroup>
                            <Label>Access Code:</Label>
                            <TextInput></TextInput>
                        </InputGroup>
                        <Row className="justify-content-center my-2">
                            <Col>
                                <KeyboardButton className="w-100">7</KeyboardButton>
                            </Col>
                            <Col>
                                <KeyboardButton className="w-100">8</KeyboardButton>
                            </Col>
                            <Col>
                                <KeyboardButton className="w-100">9</KeyboardButton>
                            </Col>
                        </Row>
                        <Row className="justify-content-center  my-2">
                            <Col>
                                <KeyboardButton className="w-100">4</KeyboardButton>
                            </Col>
                            <Col>
                                <KeyboardButton className="w-100">5</KeyboardButton>
                            </Col>
                            <Col>
                                <KeyboardButton className="w-100">6</KeyboardButton>
                            </Col>
                        </Row>
                        <Row className="justify-content-center my-2">
                            <Col>
                                <KeyboardButton className="w-100">1</KeyboardButton>
                            </Col>
                            <Col>
                                <KeyboardButton className="w-100">2</KeyboardButton>
                            </Col>
                            <Col>
                                <KeyboardButton className="w-100">3</KeyboardButton>
                            </Col>
                        </Row>
                    </PanelBody>
                </Panel>
            </div>
        </Container>
    );
}