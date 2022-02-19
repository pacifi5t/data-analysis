import { writable } from "svelte/store";
import { ClassifiedSeries, VarSeries, identifyNormalDistrib } from "../math";
import { updateClassifiedSeries } from "./helpers";

export const fileStore = writable([]);

export const immutableSamplesStore = writable([]);

export const mutableSamplesStore = writable([]);

immutableSamplesStore.subscribe((value) => {
  mutableSamplesStore.set(value);
});

mutableSamplesStore.subscribe((value) => {
  // const classCount = Math.floor(1 + 3.32 * Math.log10(value.length));
  // classifiedDataStore.set(
  //   updateClassifiedSeries(
  //     classCount % 2 == 0 ? classCount - 1 : classCount,
  //     value[0]
  //   )
  // );
});
