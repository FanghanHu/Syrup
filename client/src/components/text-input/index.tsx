import React from "react";
import "./style.css";

export interface TextInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    children?: undefined;
}

export default function TextInput({...restOfProps}:TextInputProps) {
    return <input className="syrup-text-input" {...restOfProps}></input>
}