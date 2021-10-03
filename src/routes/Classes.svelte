<script lang="ts">
  import { ClassifiedSeries, Series } from '../utils/series';
  import { mutableDataStore, classifiedDataStore } from '../utils/stores';
  import { Button } from 'attractions';

  function updateSeries(classCount: number) {
    let limits = [];
    let limitFirst = mutableSeries.data[0];
    let limitLast = mutableSeries.data[mutableSeries.data.length - 1];

    const width = (limitLast - limitFirst) / classCount;
    limits.push(limitFirst);
    for (let i = 1; i < classCount; i++) {
      limits.push(i * width + limitFirst);
    }
    limits.push(limitLast);

    let classifiedArray = [];
    mutableSeries.data.forEach((elem, index) => {
      let classNum = 1;
      for (let i = 1; i < limits.length - 1; i++) {
        if (elem < limits[i]) {
          break;
        }
        classNum++;
      }
      for (let i = 0; i < mutableSeries.count.get(index); i++) {
        classifiedArray.push(classNum);
      }
    });

    return new ClassifiedSeries(classCount, limits, classifiedArray);
  }

  let mutableSeries: Series;
  let classifiedData: ClassifiedSeries;

  classifiedDataStore.subscribe((value) => {
    classifiedData = value;
  });

  mutableDataStore.subscribe((value) => {
    mutableSeries = value;
    if (classifiedData.length === 0) {
      classifiedDataStore.set(
        updateSeries(Math.round(Math.log2(value.length)))
      );
    }
  });
</script>

<div class="flex space-x-4">
  <span class="py-4 text-2xl font-medium">Class count:</span>
  <Button
    on:click={() => {
      classifiedDataStore.update((old) => updateSeries(old.classCount - 1));
    }}
  >
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
  <span class="py-4 text-2xl font-medium">{classifiedData.classCount}</span>
  <Button
    on:click={() => {
      classifiedDataStore.update((old) => updateSeries(old.classCount + 1));
    }}
  >
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
