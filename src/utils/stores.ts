import { writable } from 'svelte/store';
import { ClassifiedSeries, VarSeries } from './series';
import { updateClassifiedSeries } from './helpers';

export const fileStore = writable([]);

export const immutableDataStore = writable(new VarSeries());

export const mutableDataStore = writable(new VarSeries());

export const classifiedDataStore = writable(new ClassifiedSeries());

immutableDataStore.subscribe((value) => {
  mutableDataStore.set(value);
});

mutableDataStore.subscribe((value) => {
  classifiedDataStore.set(
    updateClassifiedSeries(
      Math.floor(1 + 3.32 * Math.log10(value.length)),
      value
    )
  );
});
