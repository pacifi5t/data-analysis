<script lang="ts">
  import { mutableDataStore } from "../utils/stores";
  import { onMount } from "svelte";
  import { createPGPchart } from "../utils/charts";

  let mutableSeries = $mutableDataStore;

  onMount(() => {
    if (mutableSeries.length !== 0) {
      createPGPchart(mutableSeries);
    }
  });
</script>

<div id="pgp" />
