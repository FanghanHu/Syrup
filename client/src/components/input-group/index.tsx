import React from "react";
import "./style.css";

export default function InputGroup({children, ...restOfProps} : {children?: React.ReactNode} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return <div className="syrup-input-group" {...restOfProps}>
        {children}
    </div>;
}