import React from "react";
import { Color } from '../../util/Color';

import "./style.css";

interface ButtonProps {
  children?: React.ReactNode;
  color?: Color;
  style?: React.CSSProperties;
}

/**
 * A value between 0-255 of how much whiter the glare should be than rest of the panel
 */
const GLARE = 60;

/**
 * a value between 0-255, determines how much whiter the border should be.
 */
const BORDER_WHITE = 30;

export default function Button({children, color=Color.sky_blue, style}:ButtonProps) {

  const buttonStyle: React.CSSProperties = {
    border:`1px solid rgb(${color[0] + BORDER_WHITE},${color[1] + BORDER_WHITE},${color[2] + BORDER_WHITE})`,
    backgroundImage: `linear-gradient( rgb(${Math.min(255, color[0] + GLARE)},${Math.min(255, color[1] + GLARE)},${Math.min(255, color[2] + GLARE)}), rgb(${color[0]},${color[1]},${color[2]}))`,
    ...style
  }

  return <button className="syrup-button" style={buttonStyle}>{children}</button>;
} 
