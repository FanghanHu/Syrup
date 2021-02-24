import React from "react";
import Container from "react-bootstrap/Container";
import Button from "../components/Button";
import ExpandableSideMenu from "../components/ExpandableSideMenu";
import LabelBar from "../components/LabelBar";
import { Color } from "../util/Color";

export default function Setup(): JSX.Element {

    const ButtonTheme = Color.kiwi_green;

    return (
        <Container fluid>
            <ExpandableSideMenu expanded={true}>
                <div className="d-flex flex-column justfy-content-center p-2 h-100">
                    <div className="d-flex flex-column flex-grow-1">
                        <LabelBar themeColor={Color.sky_blue} className="m-2 h3 text-center text-nowrap p-3">
                            <i className="fas fa-cog"></i> Back Office
                        </LabelBar>
                        <Button themeColor={ButtonTheme} className="m-1">
                            User Setup
                        </Button>
                        <Button themeColor={ButtonTheme} className="m-1">
                            Menu Setup
                        </Button>
                        <Button themeColor={ButtonTheme} className="m-1">
                            Table Setup
                        </Button>
                    </div>
                    <Button themeColor={Color.fire_red} className="m-1">
                        Exit
                    </Button>
                </div>
            </ExpandableSideMenu>
        </Container>
    );
}