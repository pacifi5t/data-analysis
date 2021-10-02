import { writable } from 'svelte/store';
import { Series } from './series';

export const fileStore = writable([]);

export const immutableDataStore = writable(new Series());
