import { fadeIn } from "common/styling/animations/animeAnimations";

export class CardShared {
  static readonly delayedFadeIn = fadeIn({ delay: 300, targets: null });
}
