import React from "react";
import { Color } from '../../util/Color';

interface LabelProps extends React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>{
    children?: React.ReactNode;
    themeColor?: Color;
    style?: React.CSSProperties;
}

/**
 * the text will gradient to a darker and lighter color, while middle is the color provided, top will be lighter, and bottom will be darker
 */
const GRADIENT_RANGE = 60;

/**
 * size of the dots in the background
 */
const DOT_RADIUS = 2;

/**
 * How transparent the white dots are
 */
const DOT_TRANSPARENCY = 0.1;

export default function Label({children, style, themeColor=Color.dark_gray, ...restOfProps} : LabelProps) {
    const labelStyle: React.CSSProperties = {
        color: "white",
        background:`linear-gradient(to top, rgb(${Math.max(themeColor[0] - GRADIENT_RANGE, 0)}, ${Math.max(themeColor[1] - GRADIENT_RANGE, 0)}, ${Math.max(themeColor[2] - GRADIENT_RANGE, 0)}), rgb(${themeColor[0]}, ${themeColor[1]}, ${themeColor[2]}), rgb(${Math.min(themeColor[0] + GRADIENT_RANGE, 255)}, ${Math.min(themeColor[1] + GRADIENT_RANGE, 255)}, ${Math.min(themeColor[2] + GRADIENT_RANGE, 255)})),
        repeating-linear-gradient(45deg, rgba(255,255,255,${DOT_TRANSPARENCY}) ${DOT_RADIUS}px, rgba(255,255,255,0) ${DOT_RADIUS * 2}px, rgba(255,255,255,${DOT_TRANSPARENCY}) ${DOT_RADIUS * 3}px),
        repeating-linear-gradient(135deg, rgba(255,255,255,${DOT_TRANSPARENCY}) ${DOT_RADIUS}px, rgba(255,255,255,0) ${DOT_RADIUS * 2}px, rgba(255,255,255,${DOT_TRANSPARENCY}) ${DOT_RADIUS * 3}px)
        `,
        textShadow: "0 0 4px black",
        padding: "3px",
        backgroundBlendMode: "overlay",
        ...style
    }

    return <label style={labelStyle} {...restOfProps}>{children}</label>;
}