import React from "react";
import "./style.css";
import { Color } from '../../util/Color';
import { useState } from "react";

interface ExpandableSideMenuProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    children?: React.ReactNode;
    themeColor?: Color;
}

export default function ExpandableSideMenu({children, themeColor=Color.light_gray, ...restOfProps} : ExpandableSideMenuProps) {
    const [expanded, setExpand] = useState(false);

    return (
        <div className={expanded?"syrup-expandable-side-menu":"syrup-expandable-side-menu shrink"} {...restOfProps}>
            <div>
                <i className="fas fa-arrow-left float-right m-2 " onClick={() => {setExpand(!expanded)}}></i>
            </div>
            <div className="syrup-expandable-side-menu-content">
                {children}
            </div>
        </div>
    );
}