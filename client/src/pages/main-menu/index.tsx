import React from 'react';
import { Container } from 'react-bootstrap';
import Button from "../../components/button-temp"
import VerticalCenter from '../../components/vertical-center';
import { Color } from '../../util/Color';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useHistory } from 'react-router-dom';
import CheckLoginToken from '../../components/check-login-token';
import './style.css'
import { useSetOrder } from '../../contexts/order-context';
import { useLoginToken, useSetLoginToken } from '../../contexts/login-context';

export default function MainMenu() {
    const history = useHistory();
    const setOrder = useSetOrder();
    const setLoginToken = useSetLoginToken();
    const loginToken = useLoginToken();

    const createButton = function(text: string, icon: IconProp, url: string, themeColor:Color=Color.sky_blue, beforeMove=()=>{}) {
        return (
            <div style={{paddingTop:"40%", minHeight: "4em", position:"relative"}}>
                <Button 
                    onClick={() => {
                        beforeMove();
                        history.push(url)}
                    } 
                    themeColor={themeColor} 
                    style={{
                        position:"absolute",
                        width:"100%",
                        whiteSpace: "nowrap",
                        top:0,
                        left:0,
                        bottom:0,
                        right:0
                    }}
                >
                    <FontAwesomeIcon icon={icon} style={{fontSize:"2em"}}/>
                    <br/>
                    {text}
                </Button>
            </div>
        )
        
    }

    return (
        <Container className="vh-100">
            <CheckLoginToken/>
            <VerticalCenter>
                <div className="h1 text-center m-3 text-white">Welcome, {loginToken.fullName}.</div>
                <div className="main-menu-grid">
                    {createButton("To Go", "shopping-bag", "/order", Color.sky_blue, ()=>{
                        setOrder({
                            type: "To Go"
                        });
                    })}
                    {createButton("Dine in", "chair", "/table", Color.sky_blue, ()=>{
                        setOrder({
                            type: "Dine in"
                        });
                    })}
                    {createButton("Pick up", "phone", "/customer", Color.sky_blue, ()=>{
                        setOrder({
                            type: "Pick up"
                        });
                    })}
                    {createButton("Delivery", "car", "/customer", Color.sky_blue, ()=>{
                        setOrder({
                            type: "Delivery"
                        });
                    })}
                    {createButton("Recall", "search", "/recall", Color.sky_blue)}
                    {createButton("Reports", "file-alt", "/report", Color.sky_blue)}
                    {createButton("Back Office", "cog", "/setup", Color.sky_blue)}
                    {createButton("Logout", "sign-out-alt", "/login", Color.sky_blue, ()=>{
                        setLoginToken({});
                    })}
                </div>
            </VerticalCenter>
        </Container>
    )
}