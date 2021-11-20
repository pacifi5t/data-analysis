<script lang="ts">
  import { Table } from "attractions";
  import {
    updateCharacteristicsTable,
    updateParamsTable
  } from "../utils/helpers";
  import {
    mutableDataStore,
    normalDistributionFlagStore
  } from "../utils/stores";

  const headers = [
    { text: "", value: "t" },
    { text: "Value", value: "v" },
    { text: "Standard Deviation", value: "d" },
    { text: "Confidence Interval", value: "i" }
  ];

  let mutableSeries = $mutableDataStore;
</script>

<div>
  {#if mutableSeries.length !== 0}
    <div class="flex">
      <Table
        {headers}
        items={updateCharacteristicsTable(mutableSeries)}
        class="mx-4"
      />
      {#if $normalDistributionFlagStore}
        <Table
          {headers}
          items={updateParamsTable(mutableSeries)}
          class="mx-4"
        />
      {:else}
        <div class="px-10 py-20">
          <span class="text-gray-400 text-xl"
            >No parameters. Distribution isn't normal</span
          >
        </div>
      {/if}
    </div>
  {/if}
</div>
