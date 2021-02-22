import React from "react";
import "./style.css";

interface TextInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    children?: undefined;
}

export default function TextInput({...restOfProps}:TextInputProps) {
    return <input className="syrup-text-input" {...restOfProps}></input>
}