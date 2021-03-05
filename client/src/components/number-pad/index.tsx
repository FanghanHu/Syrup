import React from "react";
import KeyboardButton from "../keybord-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface NumberPadProp {
    text: string;
    setText(text: string): void;
    onEnter():void;
    style?: React.CSSProperties;
    className?: string;
}

export default function NumberPad({text, setText, onEnter, style, className}: NumberPadProp) {

    const createKeyboardButton = function(char: string, style?: React.CSSProperties):JSX.Element {
        return (
            <KeyboardButton onClick={() => {setText(text + char)}} style={style}>
                {char}
            </KeyboardButton>
        );
    }

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "3px",
            ...style
        }} className={className}>
            {createKeyboardButton("7")}
            {createKeyboardButton("8")}
            {createKeyboardButton("9")}
            <KeyboardButton
            onClick={() => {setText(text.substring(0, Math.max(text.length-1, 0)))}}>
                <FontAwesomeIcon icon="long-arrow-alt-left"/>
            </KeyboardButton>
            {createKeyboardButton("4")}
            {createKeyboardButton("5")}
            {createKeyboardButton("6")}
            <KeyboardButton
            onClick={() => {setText("")}}>
                C
            </KeyboardButton>
            {createKeyboardButton("1")}
            {createKeyboardButton("2")}
            {createKeyboardButton("3")}
            <KeyboardButton style={{
                gridRow: "span 2"
            }}
            onClick={() => {onEnter()}}>
                <FontAwesomeIcon style={{transform: "scaleY(-1)"}} icon="reply"/>
            </KeyboardButton>
            {createKeyboardButton("0", {gridColumn: "span 2"})}
            <KeyboardButton
            onClick={() => {if(!text.includes('.')) setText(text + '.')}}>
                .
            </KeyboardButton>
        </div>
    );
}