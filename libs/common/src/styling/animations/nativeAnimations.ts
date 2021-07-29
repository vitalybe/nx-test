import { Utils } from "common/utils/utils";

type NativeAnimationCallback = (value: number) => void;

class RunningAnimation {
  start: number | undefined;

  readonly id: string = Utils.generateHashString();

  constructor(
    public initialValue: number,
    public transitionAmount: number,
    public duration: number,
    private callback: NativeAnimationCallback
  ) {}

  runStep(timestamp: number) {
    if (!this.start) this.start = timestamp;
    const progress = timestamp - this.start;

    const percentOfDuration = Math.min(progress / this.duration, 1);

    const nextValue = this.initialValue + this.transitionAmount * percentOfDuration;

    this.callback(nextValue);
  }
}

export class NativeAnimations {
  private static animations: Map<string, RunningAnimation> = new Map();
  private static isRunning = false;

  static addAnimation(animation: RunningAnimation) {
    if (!this.animations.has(animation.id)) {
      this.animations.set(animation.id, animation);
    }

    const run: FrameRequestCallback = (timestamp: number) => {
      this.isRunning = true;
      for (const animation of this.animations.values()) {
        animation.runStep(timestamp);

        if (!animation.start || animation.start + animation.duration < timestamp) {
          this.animations.delete(animation.id);
        }
      }

      if (this.animations.size > 0) {
        requestAnimationFrame(run);
      } else {
        this.isRunning = false;
      }
    };
    if (!this.isRunning) {
      requestAnimationFrame(run);
    }
  }

  static runValues(initial: number, amount: number, duration: number, callback: NativeAnimationCallback) {
    const animation = new RunningAnimation(initial, amount, duration, callback);
    this.addAnimation(animation);
  }
}
