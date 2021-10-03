import { writable } from 'svelte/store';
import { ClassifiedSeries, Series } from './series';
import { updateClassifiedSeries } from './helpers';

export const fileStore = writable([]);

export const immutableDataStore = writable(new Series());

export const mutableDataStore = writable(new Series());

export const classifiedDataStore = writable(new ClassifiedSeries());

immutableDataStore.subscribe((value) => {
  mutableDataStore.set(value);
});

mutableDataStore.subscribe((value) => {
  classifiedDataStore.set(
    updateClassifiedSeries(Math.round(Math.log2(value.length)), value)
  );
});
