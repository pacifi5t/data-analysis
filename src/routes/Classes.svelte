<script lang="ts">
  import { Series } from '../utils/series';
  import { onMount } from 'svelte';
  import { mutableDataStore } from '../utils/stores';
  import { Button } from 'attractions';

    //TODO: Save data in store
  function updateSeries(series: Series) {
    limits = [];
    let limitFirst = series.data[0];
    let limitLast = series.data[series.data.length - 1];

    const width = (limitLast - limitFirst) / classCount;
    limits.push(limitFirst);
    for (let i = 1; i < classCount; i++) {
      limits.push(i * width + limitFirst);
    }
    limits.push(limitLast);

    console.log(limits);
    console.log(classCount);

    let classifiedData = [];
    series.data.forEach((elem, index) => {
      let classNum = 1;
      for (let i = 1; i < limits.length - 1; i++) {
        if (elem < limits[i]) {
          break;
        }
        classNum++;
      }
      for (let i = 0; i < series.count.get(index); i++) {
        classifiedData.push(classNum);
      }
    });
    console.log(new Series(classifiedData));
  }

  let limits = [];
  let classCount = 3;
  
  onMount(() => {
    //FIXME: This will make restoring data from store impossible
    mutableDataStore.subscribe((value) => {
      classCount = Math.round(Math.log2(value.length));
      updateSeries(value);
    });
  });
  
</script>

<div class="flex space-x-4">
  <span class="py-4 text-2xl font-medium">Class count:</span>
  <Button on:click={() => classCount--}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-minus-circle"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  </Button>
  <span class="py-4 text-2xl font-medium">{classCount}</span>
  <Button on:click={() => classCount++}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-plus-circle"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  </Button>
</div>
