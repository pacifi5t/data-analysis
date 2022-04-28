import { writable } from "svelte/store";

export const fileStore = writable([]);
export const immutableSamplesStore = writable([]);
export const mutableSamplesStore = writable([]);
export const attributesStore = writable([]);

immutableSamplesStore.subscribe((value) => {
  mutableSamplesStore.set(value);
});
