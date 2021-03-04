import React from "react";
import { Color } from '../../util/Color';

import "./style.css";

interface KeyboardButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  themeColor?: Color;
  textThemeColor?: Color;
  style?: React.CSSProperties;
}

/**
 * How much darker the side of panel should be.
 */
const EDGE_DARKEN = 20;


export default function KeyboardButton({children, className, themeColor=Color.almost_white, textThemeColor=Color.sky_blue, style, ...restOfProps}:KeyboardButtonProps) {
  //merge style if one is given
  const buttonStyle: React.CSSProperties = {
    color: `rgb(${textThemeColor[0]}, ${textThemeColor[1]}, ${textThemeColor[2]})`,
    backgroundImage: `linear-gradient(90deg, rgb(${Math.min(themeColor[0] - EDGE_DARKEN, 255)},${Math.min(themeColor[1] - EDGE_DARKEN, 255)},${Math.min(themeColor[2] - EDGE_DARKEN, 255)}) 0%, rgb(${themeColor[0]},${themeColor[1]},${themeColor[2]}) 25%, rgb(${themeColor[0]},${themeColor[1]},${themeColor[2]}) 75%, rgb(${Math.max(themeColor[0] - EDGE_DARKEN, 0)},${Math.max(themeColor[1] - EDGE_DARKEN, 0)},${Math.max(themeColor[2] - EDGE_DARKEN, 0)}) 100%)`,
    ...style
  }

  //merge className if one is given, spread rest of the props on button
  return <button className={className?className + " syrup-keyboard-button":"syrup-keyboard-button"} style={buttonStyle} {...restOfProps}>
    <div className="syrup-keyboard-button-inner">
      {children}
    </div>
  </button>;
} 
