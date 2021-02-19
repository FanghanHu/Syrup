export const Color = {
  black: [0, 0, 0],
  white: [255, 255, 255],
  sky_blue: [50, 169, 237]
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Color = typeof Color[keyof typeof Color];
