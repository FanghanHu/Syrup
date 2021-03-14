import React from "react";
import "./style.css";
import { Color } from '../../util/Color';
import { useState } from "react";

interface ExpandableSideMenuProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    children?: React.ReactNode;
    themeColor?: Color;
    /**
     * if the side menu is expanded by default
     */
    defaultExpanded?: boolean;
    expanded?: boolean;
    setExpanded?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ExpandableSideMenu({children, expanded, setExpanded, themeColor=Color.light_gray, defaultExpanded, ...restOfProps} : ExpandableSideMenuProps) {
    let isExpanded;
    let setIsExpanded;
    const expandState = useState(defaultExpanded);
    if(setExpanded) {
        isExpanded = expanded;
        setIsExpanded =setExpanded;
    } else {
        isExpanded = expandState[0];
        setIsExpanded = expandState[1];
    }
    

    return (
        <div className={isExpanded?"syrup-expandable-side-menu":"syrup-expandable-side-menu shrink"} {...restOfProps}>
            <div>
                <i className="fas fa-arrow-left float-right m-2 " onClick={() => {setIsExpanded(!isExpanded)}}></i>
            </div>
            <div className="syrup-expandable-side-menu-content">
                {children}
            </div>
        </div>
    );
}