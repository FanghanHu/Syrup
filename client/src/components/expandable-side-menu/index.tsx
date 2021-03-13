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
    expanded?: boolean;
}

export default function ExpandableSideMenu({children, themeColor=Color.light_gray, expanded, ...restOfProps} : ExpandableSideMenuProps) {
    const [isExpanded, setExpand] = useState(expanded);

    return (
        <div className={isExpanded?"syrup-expandable-side-menu":"syrup-expandable-side-menu shrink"} {...restOfProps}>
            <div>
                <i className="fas fa-arrow-left float-right m-2 " onClick={() => {setExpand(!isExpanded)}}></i>
            </div>
            <div className="syrup-expandable-side-menu-content">
                {children}
            </div>
        </div>
    );
}