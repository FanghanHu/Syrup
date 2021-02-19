import React from "react";
import { Color } from '../../util/Color';

interface PanelProps {
  children?: React.ReactNode;
  color?: Color;
  style?: React.CSSProperties;
}

/**
 * A value between 0-255 of how much whiter the glare should be than rest of the panel
 */
const GLARE = 90;
const GLARE_ALPHA = 0.3
const ALPHA = 0.8;


export default function Panel({children, color=Color.black, style, ...restOfProps}: PanelProps) {
  //additional style to make the galssy background effect
  const panelStyle:React.CSSProperties = {
    border: "1px solid lightgray",
    borderRadius: "8px",
    backgroundImage: `radial-gradient(90% 1.5rem at 50% -0.8rem, rgba(${Math.min(255, color[0] + GLARE)},${Math.min(255, color[1] + GLARE)},${Math.min(255, color[2] + GLARE)}, ${GLARE_ALPHA}) 80%, rgba(${color[0]},${color[1]},${color[2]}, ${ALPHA}))`,
    backdropFilter: "blur(1px) saturate(100%) contrast(45%) brightness(130%)",
    boxShadow: "0 0 4px black",
    ...style
  }

  //spread rest of the props to the parent div
  return <div style={panelStyle} {...restOfProps}>
      {children}
  </div>;
}
