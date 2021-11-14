<script lang="ts">
  import { Table } from "attractions";
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
    items
  });
</script>

<div>
  <Table {headers} {items} />
</div>
