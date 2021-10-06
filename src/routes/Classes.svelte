<script lang="ts">
  import type { ClassifiedSeries } from '../utils/series';
  import { mutableDataStore, classifiedDataStore } from '../utils/stores';
  import { Button, Table } from 'attractions';
  import { pretty, updateClassifiedSeries } from '../utils/helpers';

  const headers = [
    { text: 'class num', value: 'c' },
    { text: 'limits', value: 'l' },
    { text: 'count', value: 'n' },
    { text: 'frequency', value: 'p' },
    { text: 'empirical distribution function', value: 'F' }
  ];
  let items = [];
  let mutableSeries = $mutableDataStore;
  let classifiedData: ClassifiedSeries;

  classifiedDataStore.subscribe((value) => {
    classifiedData = value;
    //console.log(value);
  });

  $: {
    items = [];
    for (let i = 0; i < classifiedData.data.length; i++) {
      items.push({
        c: classifiedData.data[i],
        l: `${pretty(classifiedData.limits[i])} - ${pretty(
          classifiedData.limits[i + 1]
        )}`,
        n: classifiedData.count.get(i),
        p: classifiedData.frequency.get(i),
        F: classifiedData.empDistrFunc.get(i)
      });
    }
    console.log(items);
  }
</script>

<div>
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
    {#if classifiedData.classCount >= 0}
      <span class="py-4 text-2xl font-medium">{classifiedData.classCount}</span>
    {/if}
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
  {#if classifiedData.length !== 0}
    <Table {headers} {items} />
  {/if}
</div>
