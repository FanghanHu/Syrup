import React from "react";
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

export default function Setup(): JSX.Element {
    const history = useHistory();
    const ButtonTheme = Color.kiwi_green;

    const {url} = useRouteMatch();
    

    return (
        <Container fluid>
            <CheckLoginToken/>
            <ExpandableSideMenu expanded={true}>
                <div className="d-flex flex-column justfy-content-center p-2 h-100">
                    <div className="d-flex flex-column flex-grow-1">
                        <LabelBar themeColor={Color.sky_blue} className="m-2 h3 text-center text-nowrap p-3">
                            <FontAwesomeIcon icon="cog"/> Back Office
                        </LabelBar>
                        <Button themeColor={ButtonTheme} className="m-1" onClick={() => {
                            history.replace(`${url}/user`);
                        }}>
                            <FontAwesomeIcon icon="users"/> User Setup
                        </Button>
                        <Button themeColor={ButtonTheme} className="m-1" onClick={() => {
                            history.replace(`${url}/menu`);
                        }}>
                            <FontAwesomeIcon icon="book"/> Menu Setup
                        </Button>
                        <Button themeColor={ButtonTheme} className="m-1" onClick={() => {
                            history.replace(`${url}/table`);
                        }}>
                            <FontAwesomeIcon icon="chair"/> Table Setup
                        </Button>
                    </div>
                    <Button themeColor={Color.fire_red} className="m-1" onClick={() => {
                        history.goBack();
                    }}>
                    <FontAwesomeIcon icon="sign-out-alt"/> Exit
                    </Button>
                </div>
            </ExpandableSideMenu>
            {/* Routes */}
            <Route exact path={`${url}/user`} component={UserSetup}/>
            <Route exact path={`${url}/table`} component={TableSetup}/>
            <Route exact path={`${url}/menu`} component={MenuSetup}/>
        </Container>
    );
}