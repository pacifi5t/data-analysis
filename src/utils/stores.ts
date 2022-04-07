import { writable } from "svelte/store";

export const fileStore = writable([]);
export const immutableSamplesStore = writable([]);
export const mutableSamplesStore = writable([]);

immutableSamplesStore.subscribe((value) => {
  mutableSamplesStore.set(value);
});
