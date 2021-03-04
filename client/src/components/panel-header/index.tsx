import React from "react";
import { Color } from '../../util/Color';
import "./style.css";

interface PanelHeaderProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    children?: React.ReactNode;
    themeColor?: Color;
    style?: React.CSSProperties;
}

/**
 * the text will gradient to a darker and lighter color, while middle is the color provided, top will be lighter, and bottom will be darker
 */
const GRADIENT_RANGE = 130;

export default function PanelHeader({children, style, themeColor=Color.gold, ...restOfProps} : PanelHeaderProps) {
    const panelHeaderStyle: React.CSSProperties = {
        color: "rgba(0,0,0,0)",
        background:`linear-gradient(to top, rgb(${Math.max(themeColor[0] - GRADIENT_RANGE, 0)}, ${Math.max(themeColor[1] - GRADIENT_RANGE, 0)}, ${Math.max(themeColor[2] - GRADIENT_RANGE, 0)}), rgb(${themeColor[0]}, ${themeColor[1]}, ${themeColor[2]}), rgb(${Math.min(themeColor[0] + GRADIENT_RANGE, 255)}, ${Math.min(themeColor[1] + GRADIENT_RANGE, 255)}, ${Math.min(themeColor[2] + GRADIENT_RANGE, 255)}))`,
        WebkitBackgroundClip:"text",
        MozBackgroundClip: "text",
        textShadow: "0 0 2px rgba(0,0,0,0.1)",
        textAlign: "center",
        fontFamily: "'VT323', monospace",
        fontWeight: 600,
        fontSize: "1.2rem",
        padding: "3px",
        ...style
    }

    return <div style={panelHeaderStyle} {...restOfProps}>{children}</div>;
}