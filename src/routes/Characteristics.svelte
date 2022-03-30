<script lang="ts">
  import { Table } from "attractions";
  import type * as mymath from "../math";
  import { updateCharacteristicsTable } from "../utils/helpers";
  import { mutableSamplesStore } from "../utils/stores";

  const headers = [
    { text: "", value: "title" },
    { text: "Value", value: "val" },
    { text: "Standard Deviation", value: "stddev" },
    { text: "Confidence Interval", value: "conf" }
  ];

  let mutableSamples: mymath.VarSeries[] = [];
  let items = [];

  mutableSamplesStore.subscribe((value: mymath.VarSeries[]) => {
    mutableSamples = value;
    if (value.length != 0) {
      for (let index = 0; index < value.length; index++) {
        items[index] = updateCharacteristicsTable(mutableSamples[index]);
      }
    }
  });
</script>

{#each items as item}
  <Table class="pb-8" {headers} items={item} />
{/each}
