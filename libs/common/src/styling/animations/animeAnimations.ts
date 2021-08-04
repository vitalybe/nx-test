// @ts-ignore
import anime from "animejs";

export const fadeIn = (config?: anime.AnimeParams) => (el: HTMLElement) => {
  anime({
    targets: el,
    opacity: [0, 1],
    duration: 500,
    easing: "easeOutSine",
    ...config,
  });
};

export const fadeOut = (config?: anime.AnimeParams) => (el: HTMLElement, index: unknown, removeElement: () => void) => {
  anime({
    targets: el,
    opacity: [1, 0],
    duration: 250,
    // This is needed due to a bug with react-flip-toolkit: https://github.com/aholachek/react-flip-toolkit/issues/29
    translateX: ["0", "0"],
    complete: () => {
      removeElement();
    },
    easing: "easeOutSine",
    ...config,
  });
};

export const flyOutLeft = (config?: anime.AnimeParams) => (
  el: HTMLElement,
  index: unknown,
  removeElement: () => void
) => {
  anime({
    targets: el,
    opacity: [1, 0],
    duration: 250,
    translateX: ["0", "-50px"],
    complete: () => {
      removeElement();
    },
    easing: "easeOutSine",
    ...config,
  });
};
