import React from "react";
import InputGroup from "./input-group";
import Label from "./label";
import TextInput from "./text-input";

export interface LabeledTextInputProps extends 
React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>  {
    title: string,
    value: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export default function LabeledTextInput({title, value, onChange, ...restOfProps}: LabeledTextInputProps) {
    return (
        <InputGroup {...restOfProps}>
            <Label>{title}</Label>
            <TextInput value={value} onChange={onChange}/>
        </InputGroup>
    );
}