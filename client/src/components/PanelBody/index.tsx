import React from "react";
import { Color } from '../../util/Color';

interface PanelBodyProps {
    children?: React.ReactNode;
    color?: Color;
    style?: React.CSSProperties;
}

/**
 * How much darker the side of panel should be.
 */
const EDGE_DARKEN = 33;

export default function PanelBody ({children, color=Color.white, style, ...restOfProps}: PanelBodyProps) {
  //additional style to make the galssy background effect
  const panelBodyStyle:React.CSSProperties = {
    border: "1px solid black",
    backgroundImage: `linear-gradient(90deg, rgb(${Math.min(color[0] - EDGE_DARKEN, 255)},${Math.min(color[1] - EDGE_DARKEN, 255)},${Math.min(color[2] - EDGE_DARKEN, 255)}) 0%, rgb(${color[0]},${color[1]},${color[2]}) 25%, rgb(${color[0]},${color[1]},${color[2]}) 75%, rgb(${Math.max(color[0] - EDGE_DARKEN, 0)},${Math.max(color[1] - EDGE_DARKEN, 0)},${Math.max(color[2] - EDGE_DARKEN, 0)}) 100%)`,
    borderRadius: "8px",
    boxShadow: "inset 0 0 4px darkgray",
    ...style
  }

  //spread rest of the props to the parent div
  return <div style={panelBodyStyle} {...restOfProps}>
      {children}
  </div>;
}