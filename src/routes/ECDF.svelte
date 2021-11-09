<script lang="ts">
  import { onMount } from "svelte";
  import { createECDFChart as createECDFChart } from "../utils/charts";
  import { mutableDataStore } from "../utils/stores";

  onMount(() => {
    let mutableData = $mutableDataStore;
    let parsedSeries: { x1: number; x2: number; y: number }[] = [];
    for (let i = 0; i < mutableData.data.length - 1; i++) {
      let temp = {
        x1: mutableData.data[i],
        x2: mutableData.data[i + 1],
        y: mutableData.empDistrFunc.get(i)
      };
      if (temp.x2 === undefined) {
        temp.x2 = temp.x1;
      }
      parsedSeries.push(temp);
    }

    if (parsedSeries.length != 0) {
      createECDFChart(parsedSeries);
    }
  });
</script>

<div id="ecdf" />
