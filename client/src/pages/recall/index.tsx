import React from "react";
import { Container } from "react-bootstrap";
import Panel from "../../components/panel";
import PanelHeader from "../../components/panel-header";

export default function Recall() {
    return (
        <Container className="vh-100 position-relative py-3">
            <Panel className="w-100 h-100 d-flex flex-column">
                <PanelHeader>
                    Recall
                </PanelHeader>
            </Panel>
        </Container>
    )
}