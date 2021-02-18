import React from "react";
import "./style.css";

interface PanelProps {
  children?: any;
  color?: [number,number,number];
  style?: React.CSSProperties;
  [index: string]: any;
}

export default function Panel({children, color=[0,0,0], style, ...restOfProps}: PanelProps) {
  //additional style to make the galssy background effect
  const panelStyle:React.CSSProperties = {
    border: "1px solid lightgray",
    borderRadius: "8px",
    backgroundImage: `radial-gradient(90% 1.5rem at 50% -0.8rem, rgba(${color[0]},${color[1]},${color[2]}, 0.3) 80%, rgba(${color[0]},${color[1]},${color[2]}, 0.9))`,
    backdropFilter: "blur(2px) saturate(100%) contrast(45%) brightness(130%)",
    boxShadow: "0 0 4px black",
    ...style
  }

  //spread rest of the props to the parent div
  return <div style={panelStyle} {...restOfProps}>
      {children}
  </div>;
}
