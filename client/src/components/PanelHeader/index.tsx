import React from "react";
import { Color } from '../../util/Color';
import "./style.css";

interface PanelHeaderProps {
    children?: React.ReactNode;
    color?: Color;
    style?: React.CSSProperties;
}

/**
 * the text will gradient to a darker and lighter color, while middle is the color provided, top will be lighter, and bottom will be darker
 */
const GRADIENT_RANGE = 60;

export default function PanelHeader({children, style, color=Color.gold} : PanelHeaderProps) {
    const panelHeaderStyle: React.CSSProperties = {
        color: "rgba(0,0,0,0)",
        background:`linear-gradient(to top, rgb(${Math.max(color[0] - GRADIENT_RANGE, 0)}, ${Math.max(color[1] - GRADIENT_RANGE, 0)}, ${Math.max(color[2] - GRADIENT_RANGE, 0)}), rgb(${color[0]}, ${color[1]}, ${color[2]}), rgb(${Math.min(color[0] + GRADIENT_RANGE, 255)}, ${Math.min(color[1] + GRADIENT_RANGE, 255)}, ${Math.min(color[2] + GRADIENT_RANGE, 255)}))`,
        WebkitBackgroundClip:"text",
        MozBackgroundClip: "text",
        textShadow: "0 0 2px rgba(0,0,0,0.1)",
        textAlign: "center",
        fontFamily: "'VT323', monospace",
        fontWeight: 600,
        fontSize: "1.2rem",
        ...style
    }

    return <div style={panelHeaderStyle}>{children}</div>;
}