import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "../../components/button";
import ExpandableSideMenu from "../../components/expandable-side-menu";
import LabelBar from "../../components/label-bar";
import { Color } from "../../util/Color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckLoginToken from "../../components/check-login-token";
import {Route, useHistory, useRouteMatch } from "react-router-dom";
import UserSetup from "./user-setup";
import TableSetup from "./table-setup";
import MenuSetup from "./menu-setup";
import VerticalCenter from "../../components/vertical-center";
import './style.css';

export default function Setup(): JSX.Element {
    const history = useHistory();
    const ButtonTheme = Color.kiwi_green;

    const {url} = useRouteMatch();
    
    const [expanded, setExpanded] = useState(true);

    return (
        <Container fluid className="vh-100">
            <CheckLoginToken/>
            <ExpandableSideMenu defaultExpanded={true} expanded={expanded} setExpanded={setExpanded} style={{
                zIndex: 99
            }}>
                <div className="d-flex flex-column justfy-content-center p-2 h-100">
                    <div className="d-flex flex-column flex-grow-1">
                        <LabelBar themeColor={Color.sky_blue} className="m-2 h3 text-center text-nowrap p-3">
                            <FontAwesomeIcon icon="cog"/> Back Office
                        </LabelBar>
                        <Button themeColor={ButtonTheme} className="m-1" onClick={() => {
                            history.replace(`${url}/user`);
                            setExpanded(false);
                        }}>
                            <FontAwesomeIcon icon="users"/> User Setup
                        </Button>
                        <Button themeColor={ButtonTheme} className="m-1" onClick={() => {
                            history.replace(`${url}/menu`);
                            setExpanded(false);
                        }}>
                            <FontAwesomeIcon icon="book"/> Menu Setup
                        </Button>
                        <Button themeColor={ButtonTheme} className="m-1" onClick={() => {
                            history.replace(`${url}/table`);
                            setExpanded(false);
                        }}>
                            <FontAwesomeIcon icon="chair"/> Table Setup
                        </Button>
                    </div>
                    <Button themeColor={Color.gray} className="m-1" onClick={() => {
                        history.goBack();
                    }}>
                    <FontAwesomeIcon icon="sign-out-alt"/> Exit
                    </Button>
                </div>
            </ExpandableSideMenu>
            {/* Routes */}
            <Route exact path={`${url}`}> 
                <VerticalCenter>
                <div style={{
                        fontSize: "2.3em",
                        textAlign: "center",
                        color: "lightgray",
                        lineHeight: "1em"
                    }}>
                        Welcome to the
                    </div>
                    <div style={{
                        fontSize: "4em",
                        textAlign: "center",
                        color: "white",
                        lineHeight: "1em"
                    }}>
                        Back Office
                    </div>
                </VerticalCenter>
            </Route>
            <Route exact path={`${url}/user`} component={UserSetup}/>
            <Route exact path={`${url}/table`} component={TableSetup}/>
            <Route exact path={`${url}/menu`} component={MenuSetup}/>
        </Container>
    );
}