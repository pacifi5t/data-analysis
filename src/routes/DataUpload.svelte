<script lang="ts">
  import { FileDropzone, Table } from "attractions";
  import { immutableSamplesStore, fileStore } from "../utils/stores";
  import { pretty } from "../utils/helpers";
  import { VarSeries } from "../math";
  import { filter } from "d3";

  const reader = new FileReader();
  const headers = [
    { text: "index", value: "i" },
    { text: "element", value: "x" },
    { text: "count", value: "n" },
    { text: "frequency", value: "p" },
    { text: "ecdf", value: "F" }
  ];
  let items1 = [];
  let items2 = [];
  let uplodedFiles = [];
  let immutableSamples: VarSeries[];

  fileStore.subscribe((value) => {
    uplodedFiles = value;
  });
  immutableSamplesStore.subscribe((value) => {
    immutableSamples = value;
  });

  $: {
    if (immutableSamples.length != 0) {
      items1 = [];
      for (let i = 0; i < immutableSamples[0].data.length; i++) {
        items1.push({
          i: i.toString(),
          x: immutableSamples[0].data[i],
          n: pretty(immutableSamples[0].count.get(i)),
          p: pretty(immutableSamples[0].frequency.get(i)),
          F: pretty(immutableSamples[0].empDistrFunc.get(i))
        });
      }

      items2 = [];
      for (let i = 0; i < immutableSamples[1].data.length; i++) {
        items2.push({
          i: i.toString(),
          x: immutableSamples[1].data[i],
          n: pretty(immutableSamples[1].count.get(i)),
          p: pretty(immutableSamples[1].frequency.get(i)),
          F: pretty(immutableSamples[1].empDistrFunc.get(i))
        });
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
          new VarSeries(dataSample1),
          new VarSeries(dataSample2)
        ]);
      };
    }}
  />
</div>

{#if immutableSamples.length !== 0}
  <div class="grid grid-cols-2 gap-4">
    <div>
      <Table {headers} items={items1} />
    </div>
    <div>
      <Table {headers} items={items2} />
    </div>
  </div>
{/if}

<style>
  div {
    max-height: 640px;
  }
</style>
