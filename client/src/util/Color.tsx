export const Color = {
  black: [0, 0, 0],
  light_gray: [222, 222, 222],
  gray: [150, 150, 150],
  dark_gray: [96, 96, 96],
  white: [255, 255, 255],
  sky_blue: [50, 169, 237],
  fire_red: [222, 46, 10],
  light_green: [143, 196, 20],
  kiwi_green: [93, 146, 0],
  gold: [255, 187, 0],
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Color = typeof Color[keyof typeof Color];
