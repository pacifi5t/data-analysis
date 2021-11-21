<script lang="ts">
  import { createAnomaliesChart } from "../utils/charts";
  import { onMount } from "svelte";
  import { immutableDataStore, mutableDataStore } from "../utils/stores";
  import * as mymath from "../math";
  import { Button } from "attractions";
  import { purgeAnomalies } from "../utils/helpers";

  let mutableSeries = $mutableDataStore;
  let a: number;
  let b: number;

  onMount(() => {
    if (mutableSeries.length !== 0) {
      const k = 2.5;
      const q1 = mymath.quartile1(mutableSeries);
      const q3 = mymath.quartile3(mutableSeries);
      a = q1 - k * (q3 - q1);
      b = q3 + k * (q3 - q1);
      createAnomaliesChart(mutableSeries, a, b);
    }
  });
</script>

<div id="anomalies" />
{#if mutableSeries.length != 0}
  <div class="flex">
    <Button
      on:click={() => {
        mutableSeries = purgeAnomalies(mutableSeries, a, b);
        mutableDataStore.set(mutableSeries);
        createAnomaliesChart(mutableSeries, a, b);
      }}
    >
      Purge anomalies
    </Button>
    <Button
      on:click={() => {
        mutableDataStore.set($immutableDataStore);
        mutableSeries = $mutableDataStore;
        createAnomaliesChart(mutableSeries, a, b);
      }}
    >
      Reset
    </Button>
  </div>
{/if}
