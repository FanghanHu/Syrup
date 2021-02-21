import React from "react";
import { Color } from '../../util/Color';

interface PanelBodyProps {
    children?: React.ReactNode;
    color?: Color;
    style?: React.CSSProperties;
}

/**
 * how transparent the white glare should be
 */
const GLARE_TRANSPARENCY = 0.225;

/**
 * how much the top of the glare is faded
 */
const GLARE_TOP_FADE = 0.2;

/**
 * How much lighter the background can gradient to
 */
const GRADIENT_RANGE = 60;

/**
 * size of the dots in the background
 */
const DOT_RADIUS = 3;

/**
 * How transparent the white dots are
 */
const DOT_TRANSPARENCY = 0.2;

export default function LabelBar ({children, color=Color.fire_red, style, ...restOfProps}: PanelBodyProps) {
  //additional style to make the galssy background effect
  const panelBodyStyle:React.CSSProperties = {
    background: `
    repeating-linear-gradient(45deg, rgba(255,255,255,${DOT_TRANSPARENCY}) ${DOT_RADIUS}px, rgba(255,255,255,0) ${DOT_RADIUS * 2}px, rgba(255,255,255,${DOT_TRANSPARENCY}) ${DOT_RADIUS * 3}px),
    repeating-linear-gradient(135deg, rgba(255,255,255,${DOT_TRANSPARENCY}) ${DOT_RADIUS}px, rgba(255,255,255,0) ${DOT_RADIUS * 2}px, rgba(255,255,255,${DOT_TRANSPARENCY}) ${DOT_RADIUS * 3}px),
    linear-gradient(rgb(${color[0]}, ${color[1]}, ${color[2]}), rgb(${Math.max(color[0] + GRADIENT_RANGE, 0)}, ${Math.max(color[1] + GRADIENT_RANGE, 0)}, ${Math.max(color[2] + GRADIENT_RANGE, 0)})),
    radial-gradient(400% 600% at 100% 100%, rgba(0, 0, 0, 0) 22%, rgba(255, 255, 255, ${GLARE_TRANSPARENCY}) 22.5%),
    linear-gradient(to bottom, rgba(${color[0]}, ${color[1]}, ${color[2]}, ${GLARE_TOP_FADE}), rgba(0,0,0,0))
    `,
    backgroundBlendMode: "overlay",
    borderRadius: "4px",
    border:`1px solid rgb(${Math.max(color[0] + GRADIENT_RANGE, 0)}, ${Math.max(color[1] + GRADIENT_RANGE, 0)}, ${Math.max(color[2] + GRADIENT_RANGE, 0)})`,
    padding:"3px",
    color:"white",
    textShadow:"0 0 3px black",
    ...style
  }

  //spread rest of the props to the parent div
  return <div style={panelBodyStyle} {...restOfProps}>
      {children}
  </div>;
}