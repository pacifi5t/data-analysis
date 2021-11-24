<script lang="ts">
  import { mutableDataStore } from "../utils/stores";
  import { onMount } from "svelte";
  import { createPGPchart } from "../utils/charts";
  import { normalDistributionFlagStore } from "../utils/stores";

  let mutableSeries = $mutableDataStore;

  onMount(() => {
    if (mutableSeries.length !== 0) {
      createPGPchart(mutableSeries, $normalDistributionFlagStore);
    }
  });
</script>

<div id="pgp" />
{#if mutableSeries.length !== 0}
  <div class="mx-20">
    <p class="text-green-800">- Restored distribution function</p>
  </div>
{/if}
