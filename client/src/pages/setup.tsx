import React from "react";
import Container from "react-bootstrap/Container";
import Button from "../components/button";
import ExpandableSideMenu from "../components/expandable-side-menu";
import LabelBar from "../components/label-bar";
import { Color } from "../util/Color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Setup(): JSX.Element {

    const ButtonTheme = Color.kiwi_green;

    return (
        <Container fluid>
            <ExpandableSideMenu expanded={true}>
                <div className="d-flex flex-column justfy-content-center p-2 h-100">
                    <div className="d-flex flex-column flex-grow-1">
                        <LabelBar themeColor={Color.sky_blue} className="m-2 h3 text-center text-nowrap p-3">
                            <FontAwesomeIcon icon="cog"></FontAwesomeIcon> Back Office
                        </LabelBar>
                        <Button themeColor={ButtonTheme} className="m-1">
                            <FontAwesomeIcon icon="users"></FontAwesomeIcon> User Setup
                        </Button>
                        <Button themeColor={ButtonTheme} className="m-1">
                            <FontAwesomeIcon icon="book"></FontAwesomeIcon> Menu Setup
                        </Button>
                        <Button themeColor={ButtonTheme} className="m-1">
                            <FontAwesomeIcon icon="chair"></FontAwesomeIcon> Table Setup
                        </Button>
                    </div>
                    <Button themeColor={Color.fire_red} className="m-1">
                    <FontAwesomeIcon icon="sign-out-alt"></FontAwesomeIcon> Exit
                    </Button>
                </div>
            </ExpandableSideMenu>
        </Container>
    );
}