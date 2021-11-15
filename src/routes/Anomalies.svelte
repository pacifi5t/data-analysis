<script lang="ts">
  import { createAnomaliesChart } from "../utils/charts";
  import { onMount } from "svelte";
  import { mutableDataStore } from "../utils/stores";

  let mutableSeries = $mutableDataStore;

  onMount(() => {
    if (mutableSeries.length !== 0) {
      createAnomaliesChart(mutableSeries);
    }
  });
</script>

<div id="anomalies" />
