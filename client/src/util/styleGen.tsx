export const Color = {
  black: [0, 0, 0],
  white: [255, 255, 255],
} as const;

export function createGlassStyle(color: [r:number, g:number, b:number]): React.CSSProperties {

  return {
    border: "1px solid lightgray",
    borderRadius: "8px",
    backgroundImage: `radial-gradient(90% 1.5rem at 50% -0.8rem, rgba(${color[0]},${color[1]},${color[2]}, 0.3) 80%, rgba(${color[0]},${color[1]},${color[2]}, 0.9))`,
    backdropFilter: "blur(2px) saturate(100%) contrast(45%) brightness(130%)",
    boxShadow: "0 0 4px black"
  }
}