<script lang="ts">
  import { FileDropzone, Table } from "attractions";
  import { immutableDataStore, fileStore } from "../utils/stores";
  import { pretty } from "../utils/helpers";
  import { VarSeries } from "../math";

  const reader = new FileReader();
  const headers = [
    { text: "index", value: "i" },
    { text: "element", value: "x" },
    { text: "count", value: "n" },
    { text: "frequency", value: "p" },
    { text: "empirical cumulative distribution function", value: "F" }
  ];
  let items = [];
  let uplodedFiles = [];
  let immutableData: VarSeries;

  fileStore.subscribe((value) => {
    uplodedFiles = value;
  });
  immutableDataStore.subscribe((value) => {
    immutableData = value;
    // console.log(immutableData);
  });

  $: {
    items = [];
    for (let i = 0; i < immutableData.data.length; i++) {
      items.push({
        i: i.toString(),
        x: immutableData.data[i],
        n: pretty(immutableData.count.get(i)),
        p: pretty(immutableData.frequency.get(i)),
        F: pretty(immutableData.empDistrFunc.get(i))
      });
    }
  }
</script>

<div class="text-xl font-bold">
  <FileDropzone
    accept=".txt,.dat"
    max={1}
    files={uplodedFiles}
    on:change={(event) => {
      fileStore.set(event.detail.files);

      if (uplodedFiles.length != 0) {
        reader.readAsText(uplodedFiles[0]);

        reader.onload = () => {
          let str = "" + reader.result;
          let data = [];
          str.split(/\n| /).forEach((value) => {
            const num = Number.parseFloat(value);
            if (!isNaN(num)) {
              data.push(num);
            }
          });
          // console.log(data);

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
