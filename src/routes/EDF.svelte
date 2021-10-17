<script lang="ts">
  import { onMount } from 'svelte';
  import { edfOptions } from '../utils/chart-options';
  import { mutableDataStore } from '../utils/stores';
  // import {createChart} from '../utils/helpers';

  // let chart: ApexCharts;

  onMount(() => {
    // chart = createChart(document.getElementById('edf'), edfOptions);

    let mutableData = $mutableDataStore;
    let parsedSeries: [number, number][] = [];
    for (let i = 0; i < mutableData.length; i++) {
      parsedSeries.push([mutableData.data[i], mutableData.empDistrFunc.get(i)]);
    }
    // chart.updateSeries([{ name: 'Value', data: parsedSeries }], true);
  });
</script>

<div id="edf" />
