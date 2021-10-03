<script lang="ts">
  import ApexCharts from 'apexcharts';
  import { onMount } from 'svelte';
  import { edfOptions } from '../utils/chart-options';
  import { mutableDataStore } from '../utils/stores';

  function createChart(node: any, options: any) {
    let chart = new ApexCharts(node, options);
    chart.render();
    return chart;
  }

  let chart: ApexCharts;

  onMount(() => {
    chart = createChart(document.getElementById('edf'), edfOptions);

    let mutableData = $mutableDataStore;
    let parsedSeries: [number, number][] = [];
    for (let i = 0; i < mutableData.length; i++) {
      parsedSeries.push([mutableData.data[i], mutableData.empDistrFunc.get(i)]);
    }
    chart.updateSeries([{ name: 'Value', data: parsedSeries }], true);
  });
</script>

<div id="edf" />
