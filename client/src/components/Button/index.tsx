import React from "react";

interface ButtonProps {
  children?: any;
  color: [number, number, number];
}

export default function Button({children, color=[0,0,0]}:ButtonProps) {

  const style: React.CSSProperties = {
    
  }

  return <button style={style}>{children}</button>;
}
