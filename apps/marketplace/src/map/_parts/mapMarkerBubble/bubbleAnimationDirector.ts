import * as _ from "lodash";
// @ts-ignore
import anime from "animejs";

const ANIMATION_DURATION = 3500;
const MAX_ACTIVE_ANIMATIONS = 60;

interface BubbleData {
  id: string;
  bubble1: HTMLElement;
}

class BubbleAnimationDirector {
  private currentBubbles: BubbleData[] = [];
  private locked = false;
  private nextToAnimate = 0;

  private animateNextBubble() {
    anime({
      targets: [this.currentBubbles[this.nextToAnimate].bubble1],
      opacity: [1, 0],
      scale: [1, 20],
      duration: ANIMATION_DURATION,
      easing: "linear",
      complete: () => this.animateNextBubble(),
      delay: _.random(0, ANIMATION_DURATION),
    });

    this.nextToAnimate = (this.nextToAnimate + 1) % this.currentBubbles.length;
  }

  onBubblesReady = () => {
    this.locked = true;
    // avoid patterns in bubbles
    this.currentBubbles = _.shuffle(this.currentBubbles);

    for (let i = 0; i < MAX_ACTIVE_ANIMATIONS; i++) {
      this.animateNextBubble();
    }
  };

  private debouncer = _.debounce(this.onBubblesReady, 2000);

  addBubble(bubbleData: BubbleData) {
    if (!this.locked) {
      this.currentBubbles.push(bubbleData);
      this.debouncer();
    }
  }

  removeBubble(id: string) {
    if (!this.locked) {
      const foundIndex = this.currentBubbles.findIndex(bubbleData => bubbleData.id === id);
      if (foundIndex >= -1) {
        this.currentBubbles.splice(foundIndex, 1);
      }

      this.debouncer();
    }
  }
}

export const bubbleAnimationDirector = new BubbleAnimationDirector();
