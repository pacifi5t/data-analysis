<script lang="ts">
  import { FileDropzone, Table } from "attractions";
  import { immutableSamplesStore, fileStore } from "../utils/stores";
  import { pretty, prettyToPrecision } from "../utils/helpers";
  import { VarSeries } from "../math";

  const reader = new FileReader();
  const headers = [
    { text: "elem", value: "elem" },
    { text: "n", value: "n" },
    { text: "freq", value: "freq" },
    { text: "ecdf", value: "ecdf" }
  ];

  let uplodedFiles = [];
  let tableItemArray = [];
  let immutableSamples: VarSeries[];

  fileStore.subscribe((value) => {
    uplodedFiles = value;
  });
  immutableSamplesStore.subscribe((value) => {
    immutableSamples = value;
  });

  $: {
    if (immutableSamples.length != 0) {
      for (let i = 0; i < immutableSamples.length; i++) {
        const items = [];
        for (let j = 0; j < immutableSamples[i].data.length; j++) {
          const elem = immutableSamples[i];
          items.push({
            elem: pretty(elem.data[j]),
            n: pretty(elem.count.get(j)),
            freq: prettyToPrecision(elem.frequency.get(j), 2),
            ecdf: prettyToPrecision(elem.empDistrFunc.get(j), 2)
          });
        }
        tableItemArray.push(items);
      }
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

      if (uplodedFiles.length == 0) {
        immutableSamplesStore.set([]);
        return;
      }

      reader.readAsText(uplodedFiles[0]);

      reader.onload = () => {
        let str = "" + reader.result;
        const temp = [];
        str
          .replaceAll("\r", "")
          .split(/\n| |\t/)
          .forEach((value) => {
            const num = Number.parseFloat(value);
            if (!isNaN(num)) {
              temp.push(num);
            }
          });

        const data = [];
        for (let i = 0; i < temp.length; i += 2) {
          const first = temp[i];
          const second = temp[i + 1];
          data.push([first, second]);
        }

        // Define how to parse file
        const set = new Set();
        for (let i = 0; i < data.length; i++) {
          set.add(data[i][1]);
        }
        const dataSample1 = [];
        const dataSample2 = [];
        if (set.size != 2) {
          for (let i = 0; i < data.length; i++) {
            dataSample1.push(data[i][0]);
            dataSample2.push(data[i][1]);
          }
        } else {
          for (let i = 0; i < data.length; i++) {
            const elem = data[i];
            if (elem[1] == 0) {
              dataSample1.push(elem[0]);
            } else {
              dataSample2.push(elem[0]);
            }
          }
        }

        immutableSamplesStore.set([
          new VarSeries(dataSample1.filter((x) => x != undefined)),
          new VarSeries(dataSample2.filter((x) => x != undefined))
        ]);
      };
    }}
  />
</div>

{#if immutableSamples.length !== 0}
  <div class="flex flex-row">
    {#each tableItemArray as tableItems, i}
      <div class="flex flex-col">
        <span class="m-auto">Attribute {i + 1}</span>
        <Table class="px-4" {headers} items={tableItems} />
      </div>
    {/each}
  </div>
{/if}

<style>
  div {
    max-height: 640px;
  }
</style>
