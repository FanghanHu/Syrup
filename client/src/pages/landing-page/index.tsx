import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router";
import VerticalCenter from "../../components/vertical-center";
import "./style.css";

export default function LandingPage() {
    const [show, setShow] = useState(false);

    const history = useHistory();

    useEffect(() => {
        setShow(true);
    }, []);

    return (
        <Container 
            fluid 
            className="vh-100"
            onClick={() => {
                history.push("/login");
            }}
        >
            <VerticalCenter>
                <div className={"syrup-title" + (show?" syrup-title-show":"")}
                >
                    <div className="syrup-title-top">Syrup</div>
                    <div className="syrup-title-bottom">POS</div>
                </div>
            </VerticalCenter>
        </Container>
    )
}