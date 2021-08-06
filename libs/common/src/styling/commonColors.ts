export class CommonColors {
  static readonly QWILT_BLUE_DIM = "#1F7CB0";
  static readonly QWILT_BLUE_BRIGHT = "#2EA9EE";
  static readonly FUN_GREEN = "#00803A";
  static readonly QWILT_GREEN_DIM = "#60AD24";
  static readonly QWILT_GREEN_BRIGHT = "#84ED35";
  static readonly QWILT_RED_DIM = "#B60000";
  static readonly QWILT_RED_BRIGHT = "#F80000";
  static readonly QWILT_YELLOW_DIM = "#B8B826";
  static readonly QWILT_YELLOW_BRIGHT = "#FEFB38";

  static readonly RADICAL_RED = "#ff2254";

  static readonly ROYAL_RED = "#cf1e1e";
  static readonly ROYAL_RED_DARKENED = "#b51818";
  static readonly ROYAL_RED_DARKENED_2 = "#791010";
  static readonly ROYAL_BLUE = "#407bfb";
  static readonly ROYAL_BLUE_2 = "#214fba";
  static readonly ROYAL_BLUE_3 = "#1b419b";
  static readonly LILAC_BUSH = "#A57CCB";
  static readonly DANUBE = "#6c8fd1";
  static readonly SALMON = "#FF8A71";
  static readonly DARKEN_SALMON = "#A0604F";

  static readonly MANDY = "#E74B70";
  static readonly TANGERINE_YELLOW = "#ffce00";
  static readonly TREE_POPPY = "#FFA022";
  static readonly MOUNTAIN_MEADOW = "#15c177";
  static readonly PASTEL_GREEN = "#7fd87d";

  static readonly DEEP_SKY_BLUE = "#21a9ff";
  static readonly DEEP_SKY_BLUE_2 = "#077cc5";
  static readonly POOL_BLUE = "#00a5e8";
  static readonly MALIBU = "#6bbfff";
  static readonly GLACIER = "#79adc4";
  static readonly HIPPIE_BLUE = "#3E839D";

  static readonly NEON_BLUE = "#2d51ff";
  static readonly CHATHAMS_BLUE = "#21506E";
  static readonly NERO = "#282828";
  static readonly BLACK_PEARL = "#01222f";
  static readonly DAINTREE = "#022D3F";
  static readonly SHERPA_BLUE = "#07394c";
  static readonly TARAWERA = "#07374b";
  static readonly ARAPAWA = "#1A5065";
  static readonly BLUMINE = "#1a5f7a";
  static readonly COD_GRAY = "#191919";
  static readonly CORNFLOWER = "#8cd2ed";
  static readonly MAYA_BLUE = "#63C2FF";
  static readonly DARKEN_MAYA_BLUE = "#6299C8";
  static readonly BRIGHT_TURQUOISE = "#00f5ed";
  static readonly TURQUOISE_BLUE = "#55cde3";
  static readonly DARKEN_TURQUOISE_BLUE = "#4E8795";
  static readonly DODGER_BLUE = "#1f7cff";
  static readonly BLUE_LAGOON = "#023e55";
  static readonly BLUE_WHALE = "#133049";
  static readonly ICE_BLUE = "#ebf1fd";
  static readonly ATHENS_GRAY = "#F7F8F9";
  static readonly NOBEL = "#B6B6B6";

  static readonly NAVY_2 = "#002736";
  static readonly TANGAROA = "#0e2b3f";
  static readonly NAVY_3 = "#022e3f";
  static readonly NAVY_4 = "#07394c";
  static readonly NAVY_7 = "#0e4960";
  static readonly NAVY_8 = "#1a6c8b";
  static readonly MATISSE = "#186c8b";
  static readonly CERULEAN = "#0479A6";
  static readonly HALF_BAKED = "#97C5D8";
  static readonly ANAKIWA = "#9CE4FF";
  static readonly LIGHT_SKY_BLUE = "#90D4FF";
  static readonly ICY_IGLOO = "#EAF8FF";
  static readonly PORCELAIN = "#EBF0F2";
  static readonly PATTENS_BLUE = "#E3E9EB";
  static readonly SHMATTENS_BLUE = "#ededed";

  static readonly GEYSER = "#C7D5D9";
  static readonly GREY_CHATEAU = "#9ca1a5";
  static readonly HEATHER = "#aeb8bc";
  static readonly CASPER = "#9fb6bf";

  static readonly LILY_WHITE = "#EAF9FF";
  static readonly MYSTIC_2 = "#f8fbfc";
  static readonly MYSTIC = "#E6EDF0";
  static readonly GRAY_1 = "#e2e9eb";
  static readonly GRAY_2 = "#f7fafb";
  static readonly GRAY_4 = "#ECF0F1";
  static readonly WILD_SAND = "#F7F7F7";
  static readonly SILVER = "#C0BFBF";
  static readonly SILVER_SAND = "#B6B8B9";
  static readonly ALICE_BLUE = "#f6f8f9";
  static readonly ROLLING_STONE = "#78797A";
  static readonly NEVADA = "#626566";

  static readonly WHITE = "#ffffff";
  static readonly BLACK = "#000000";

  static getIspIndexColor(index?: number) {
    const colors = [
      "#c41100", // 1
      "#11B1E0",
      "#F5a623",
      "#7ed321",
      "#bd10e0",
      "#82063c",
      "#41b59b",
      "#b17f2e",
      "#722682",
      "#50e3c2", // 10
      "#c74a81",
      "#7255dc",
      "#65c463",
      "#d78796",
      "#5c93b7",
      "#b74883",
      "#44b7b1",
      "#f5413b",
      "#68deff",
      "#acf25f", // 20
      "#e87aff",
      "#f38c8c",
      "#84b24f",
      "#dcb26e",
      "#92afda",
      "#86d9d1",
      "#ec6bb3",
      "#b9ade7",
      "#4ed14a",
      "#fa496c", // 30
      "#209bea",
      "#e63392",
      "#1bd7cc",
      "#9517b7",
      "#3aabb7",
      "#b7454d",
      "#57b7a7",
      "#b7754e",
      "#70b74f",
      "#b73197", //40
      "#f0bd00",
      "#b21f26", // 42
    ];
    return colors[(index || colors.length - 1) % colors.length];
  }
}
