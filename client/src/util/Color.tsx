export const Color = {
  white: [255, 255, 255],
  almost_white: [240, 240, 240],
  light_gray: [222, 222, 222],
  gray: [150, 150, 150],
  dark_gray: [96, 96, 96],
  black: [0, 0, 0],
  sky_blue: [50, 169, 237],
  fire_red: [222, 46, 10],
  light_green: [143, 196, 20],
  kiwi_green: [93, 146, 0],
  gold: [255, 187, 0],
  dark_gold: [176, 129, 0],
  wakanda_purple: [75, 0, 154],
  skin_pink: [253, 165, 155],
  brick_red: [176, 68, 56],
  melon_green: [68, 170, 79]
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Color = typeof Color[keyof typeof Color];
