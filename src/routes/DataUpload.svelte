<script lang="ts">
  import { FileDropzone, Table } from 'attractions';
  import { VarSeries } from '../utils/series';
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
  let immutableData: VarSeries;

  fileStore.subscribe((value) => {
    uplodedFiles = value;
  });
  immutableDataStore.subscribe((value) => {
    immutableData = value;
  });

  $: {
    items = [];
    for (let i = 0; i < immutableData.data.length; i++) {
      items.push({
        i: i.toString(),
        x: immutableData.data[i],
        n: immutableData.count.get(i),
        p: immutableData.frequency.get(i),
        F: immutableData.empDistrFunc.get(i)
      });
    }
  }
</script>

<div class="text-xl font-bold">
  <FileDropzone
    accept="text/*"
    max={1}
    files={uplodedFiles}
    on:change={(event) => {
      fileStore.set(event.detail.files);

      if (uplodedFiles.length != 0) {
        reader.readAsText(uplodedFiles[0]);

        reader.onload = () => {
          let str = '' + reader.result;
          let data = [];
          str.split('\n').forEach((value) => {
            data.push(Number.parseFloat(value));
          });
          immutableDataStore.set(new VarSeries(data));
        };
      } else {
        immutableDataStore.set(new VarSeries());
      }
    }}
  />
</div>

{#if immutableData.length !== 0}
  <div class="flex flex-row justify-center overflow-auto">
    <Table {headers} {items} />
  </div>
{/if}

<style>
  div {
    max-height: 640px;
  }
</style>
