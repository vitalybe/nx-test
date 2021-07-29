// handles TypeError: Reflect.getMetadata is not a function
require("reflect-metadata");
const noop = () => {};
Object.defineProperty(window, "scroll", { value: noop, writable: true });
