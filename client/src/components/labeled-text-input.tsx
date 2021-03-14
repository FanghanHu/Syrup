import React from "react";
import { CSSProperties } from "react";
import { Color } from "../util/Color";
import InputGroup from "./input-group";
import Label from "./label";
import TextInput, { TextInputProps } from "./text-input";

export interface LabeledTextInputProps extends 
React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>  {
    title: string,
    value: string,
    labelStyle?: CSSProperties,
    labelColorTheme?: Color,
    inputProps?: TextInputProps,
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export default function LabeledTextInput({title, value, onChange, 
    labelColorTheme, inputProps, labelStyle, ...restOfProps}: LabeledTextInputProps) {
    return (
        <InputGroup {...restOfProps}>
            <Label style={labelStyle} themeColor={labelColorTheme}>{title}</Label>
            <TextInput value={value}  onChange={onChange}  {...inputProps}/>
        </InputGroup>
    );
}