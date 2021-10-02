<script lang="ts">
  import ApexCharts from 'apexcharts';
  import { onMount } from 'svelte';
  import { edfOptions } from '../utils/chart-options';
  import { immutableDataStore } from '../utils/stores';

  function createChart(node: any, options: any) {
    let chart = new ApexCharts(node, options);
    chart.render();
    return chart;
  }

  let chart: ApexCharts;

  onMount(() => {
    chart = createChart(document.getElementById('edf'), edfOptions);

    immutableDataStore.subscribe((value) => {
      let parsedSeries: [number, number][] = [];
      for (let i = 0; i < value.length; i++) {
        parsedSeries.push([value.data[i], value.empDistrFunc.get(i)]);
      }
      chart.updateSeries([{ name: 'Value', data: parsedSeries }], true);
    });
  });
</script>

<div id="edf" />
