import React from 'react';
import { Container } from 'react-bootstrap';
import Button from "../components/button"
import VerticalCenter from '../components/vertical-center';
import { Color } from '../util/Color';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useHistory } from 'react-router-dom';
import CheckLoginToken from '../components/check-login-token';

export default function MainMenu() {
    const history = useHistory();

    const createButton = function(text: string, icon: IconProp, url: string, themeColor:Color=Color.sky_blue) {
        return <div style={{paddingTop:"40%", minHeight: "4em", position:"relative"}}>
            <Button onClick={() => { history.push(url)}} themeColor={themeColor} style={{
                position:"absolute",
                width:"100%",
                top:0,
                left:0,
                bottom:0,
                right:0
            }}>
                <FontAwesomeIcon icon={icon} style={{fontSize:"2em"}}/>
                <br/>
                {text}
            </Button>
        </div>
    }

    return (
        <Container className="vh-100">
            <CheckLoginToken/>
            <VerticalCenter>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: "3px"
                }}>
                    {createButton("Express", "hamburger", "/order")}
                </div>
            </VerticalCenter>
        </Container>
    )
}