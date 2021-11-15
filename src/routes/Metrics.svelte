<script lang="ts">
  import { Table } from "attractions";
  import { updateMetricsTable } from "../utils/helpers";
  import { onMount } from "svelte";
  import { mutableDataStore } from "../utils/stores";

  const headers = [
    { text: "", value: "t" },
    { text: "Value", value: "v" },
    { text: "Standard Deviation", value: "d" },
    { text: "Confidence Interval", value: "i" }
  ];

  let items = [];
  let mutableSeries = $mutableDataStore;

  onMount(() => {
    if (mutableSeries.length !== 0) {
      items = updateMetricsTable(mutableSeries);
    }
  });
</script>

<div>
  {#if mutableSeries.length !== 0}
    <Table {headers} {items} />
  {/if}
</div>
