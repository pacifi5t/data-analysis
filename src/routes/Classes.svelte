<script lang="ts">
  import type { ClassifiedSeries, Series } from '../utils/series';
  import { mutableDataStore, classifiedDataStore } from '../utils/stores';
  import { Button } from 'attractions';
  import { updateClassifiedSeries } from '../utils/helpers';

  let mutableSeries = $mutableDataStore;
  let classifiedData: ClassifiedSeries;

  classifiedDataStore.subscribe((value) => {
    classifiedData = value;
    console.log(value);
  });
</script>

<div class="flex space-x-4">
  <span class="py-4 text-2xl font-medium">Class count:</span>
  <Button
    on:click={() => {
      classifiedDataStore.update((old) =>
        updateClassifiedSeries(old.classCount - 1, mutableSeries)
      );
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-minus-circle"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  </Button>
  <span class="py-4 text-2xl font-medium">{classifiedData.classCount}</span>
  <Button
    on:click={() => {
      classifiedDataStore.update((old) =>
        updateClassifiedSeries(old.classCount + 1, mutableSeries)
      );
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-plus-circle"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  </Button>
</div>
