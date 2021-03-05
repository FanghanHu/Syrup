import React from "react";
import "./style.css";

interface InputGroupProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children?: React.ReactNode
} 

export default function InputGroup({children, className, ...restOfProps} : InputGroupProps) {
    return <div className={className?"syrup-input-group " + className: "syrup-input-group "} {...restOfProps}>
        {children}
    </div>;
}