const noop = () => {};
Object.defineProperty(window, "scroll", { value: noop, writable: true });
