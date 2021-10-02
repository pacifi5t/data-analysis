<script lang="ts">
  import { FileDropzone, Table } from 'attractions';
  import { Series } from '../utils/series';
  import { immutableDataStore, fileStore } from '../utils/stores';

  const reader = new FileReader();
  const headers = [
    { text: 'index', value: 'i' },
    { text: 'element', value: 'x' },
    { text: 'count', value: 'n' },
    { text: 'frequency', value: 'p' },
    { text: 'empirical distribution function', value: 'F' }
  ];
  let items = [];

  let uplodedFiles = [];
  let immutableData = [];

  fileStore.subscribe((value) => {
    uplodedFiles = value;
  });
  immutableDataStore.subscribe((value) => {
    immutableData = value;
  });

  $: series = new Series(immutableData);

  $: {
    items = [];
    for (let i = 0; i < series.data.length; i++) {
      items.push({
        i: i.toString(),
        x: series.data[i],
        n: series.count.get(i),
        p: series.frequency.get(i).toPrecision(4),
        F: series.empDistrFunc.get(i).toPrecision(4)
      });
    }
    console.log(items);
  }
</script>

<div class="text-xl font-bold">
  <FileDropzone
    accept="text/*"
    max={1}
    files={uplodedFiles}
    on:change={(event) => {
      fileStore.set(event.detail.files);
      console.log(uplodedFiles);

      if (uplodedFiles.length != 0) {
        reader.readAsText(uplodedFiles[0]);

        reader.onload = () => {
          let str = '' + reader.result;
          let data = [];
          str.split('\n').forEach((value) => {
            data.push(Number.parseFloat(value));
          });
          immutableDataStore.set(data);
        };
      } else {
        immutableDataStore.set([]);
      }
    }}
  />
</div>

{#if immutableData.length != 0}
  {#if series.length !== 0}
  <div class="flex flex-row justify-center overflow-auto">
    <Table {headers} {items} />
  </div>
  {/if}
{/if}

<style>
  div {
    max-height: 640px;
  }
</style>