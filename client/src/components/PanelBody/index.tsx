import React from "react";
import { Color } from '../../util/Color';

interface PanelBodyProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    children?: React.ReactNode;
    themeColor?: Color;
    style?: React.CSSProperties;
}

/**
 * How much darker the side of panel should be.
 */
const EDGE_DARKEN = 33;

export default function PanelBody ({children, themeColor=Color.white, style, ...restOfProps}: PanelBodyProps) {
  //additional style to make the galssy background effect
  const panelBodyStyle:React.CSSProperties = {
    border: "1px solid black",
    backgroundImage: `linear-gradient(90deg, rgb(${Math.min(themeColor[0] - EDGE_DARKEN, 255)},${Math.min(themeColor[1] - EDGE_DARKEN, 255)},${Math.min(themeColor[2] - EDGE_DARKEN, 255)}) 0%, rgb(${themeColor[0]},${themeColor[1]},${themeColor[2]}) 25%, rgb(${themeColor[0]},${themeColor[1]},${themeColor[2]}) 75%, rgb(${Math.max(themeColor[0] - EDGE_DARKEN, 0)},${Math.max(themeColor[1] - EDGE_DARKEN, 0)},${Math.max(themeColor[2] - EDGE_DARKEN, 0)}) 100%)`,
    borderRadius: "8px",
    boxShadow: "inset 0 0 4px darkgray",
    padding: "10px",
    ...style
  }

  //spread rest of the props to the parent div
  return <div style={panelBodyStyle} {...restOfProps}>
      {children}
  </div>;
}