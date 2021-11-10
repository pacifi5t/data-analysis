<script lang="ts">
  import type { ClassifiedSeries } from "../utils/series";
  import { mutableDataStore, classifiedDataStore } from "../utils/stores";
  import { Button, Slider, Table } from "attractions";
  import { kde, pretty, updateClassifiedSeries } from "../utils/helpers";
  import { onMount } from "svelte";
  import { createHistogram } from "../utils/charts";

  const headers = [
    { text: "class num", value: "c" },
    { text: "limits", value: "l" },
    { text: "count", value: "n" },
    { text: "frequency", value: "p" },
    { text: "ecdf", value: "F" }
  ];
  let sliderValue = 0.5;
  let items = [];
  let mutableSeries = $mutableDataStore;
  let classifiedData: ClassifiedSeries;

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

    createHistogram(
      classifiedData,
      kde(sliderValue, mutableSeries, classifiedData.limits)
    );
  }

  onMount(() => {
    createHistogram(
      classifiedData,
      kde(sliderValue, mutableSeries, classifiedData.limits)
    );
  });
</script>

<div>
  <div class="flex space-x-4">
    <div class="flex space-x-4 flex-grow">
      <span class="py-4 text-2xl font-medium">Class count:</span>
      <Button
        on:click={() => {
          classifiedDataStore.update((old) =>
            old.classCount > 1
              ? updateClassifiedSeries(old.classCount - 1, mutableSeries)
              : old
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
        <span class="py-4 text-2xl font-medium"
          >{classifiedData.classCount}</span
        >
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
    <div class="flex-grow">
      <Slider
        bind:value={sliderValue}
        min={0.1}
        max={10.0}
        step={0.1}
        tooltips="always"
      />
      <span class="py-4 text-2xl font-medium">Bandwidth</span>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-4">
    <div>
      {#if classifiedData.classCount !== 0}
        <Table {headers} {items} />
      {/if}
    </div>
    <div>
      <div id="kde" />
    </div>
  </div>
</div>
