<script lang="ts">
  import type { ClassifiedSeries } from '../utils/series';
  import { mutableDataStore, classifiedDataStore } from '../utils/stores';
  import { Button, Table } from 'attractions';
  import {
    createChart,
    pretty,
    updateClassifiedSeries
  } from '../utils/helpers';
  import { onMount } from 'svelte';
  import { mixedChartOptions } from '../utils/chart-options';

  const headers = [
    { text: 'class num', value: 'c' },
    { text: 'limits', value: 'l' },
    { text: 'count', value: 'n' },
    { text: 'frequency', value: 'p' },
    { text: 'edf', value: 'F' }
  ];
  let items = [];
  let mutableSeries = $mutableDataStore;
  let classifiedData: ClassifiedSeries;
  let chart: ApexCharts;

  classifiedDataStore.subscribe((value) => {
    classifiedData = value;
    console.log(value);
    
  });

  $: {
    items = [];
    for (let i = 0; i < classifiedData.data.length; i++) {
      const elem = classifiedData.data[i];
      const diff = elem - i - 1;
      items.push({
        c: elem,
        l: `${pretty(classifiedData.limits[i + diff])} - ${pretty(
          classifiedData.limits[i + 1 + diff]
        )}`,
        n: classifiedData.count.get(i),
        p: classifiedData.frequency.get(i),
        F: classifiedData.empDistrFunc.get(i)
      });
    }

    if (typeof chart !== 'undefined') {
      let classFreqs = [];
      classifiedData.frequency.forEach((value) => classFreqs.push(value));
      //TODO: Use KDE function
      chart.updateSeries([{ data: classFreqs }, { data: classFreqs }]);
    }
  }

  onMount(() => {
    chart = createChart(
      document.getElementById('mixed-chart'),
      mixedChartOptions
    );
  });
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
  <div class="grid grid-cols-2 gap-4">
    <div>
      {#if classifiedData.classCount !== 0}
        <Table {headers} {items} />
      {/if}
    </div>
    <div>
      <div id="mixed-chart" />
    </div>
  </div>
</div>
