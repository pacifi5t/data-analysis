import { writable } from "svelte/store";
import { ClassifiedSeries, VarSeries, identifyNormalDistrib } from "../math";
import { updateClassifiedSeries } from "./helpers";

export const fileStore = writable([]);

export const immutableDataStore = writable(new VarSeries());

export const mutableDataStore = writable(new VarSeries());

export const classifiedDataStore = writable(new ClassifiedSeries());

export const normalDistributionFlagStore = writable(false);

immutableDataStore.subscribe((value) => {
  mutableDataStore.set(value);
  if (value.length !== 0) {
    const isNormal = identifyNormalDistrib(value);
    normalDistributionFlagStore.set(isNormal);
    if (isNormal) {
      console.log("This is a normal distribution");
    } else {
      console.log("This is not a normal distribution");
    }
  }
});

mutableDataStore.subscribe((value) => {
  const classCount = Math.floor(1 + 3.32 * Math.log10(value.length));
  classifiedDataStore.set(
    updateClassifiedSeries(
      classCount % 2 == 0 ? classCount - 1 : classCount,
      value
    )
  );
});
