import { writable } from "svelte/store";

export const fileStore = writable([]);
export const immutableSamplesStore = writable([]);
export const mutableSamplesStore = writable([]);
export const headersStore = writable([]);

immutableSamplesStore.subscribe((value) => {
  mutableSamplesStore.set(value);
});
