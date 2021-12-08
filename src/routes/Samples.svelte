<script lang="ts">
  import { Checkbox, Table } from "attractions";
  import type { VarSeries } from "../math";
  import { getDifferenceSample, updateSampleTable } from "../utils/helpers";
  import { mutableSamplesStore } from "../utils/stores";

  const headers = [
    { text: "", value: "t" },
    { text: "Value", value: "v" },
    { text: "Standard Deviation", value: "d" },
    { text: "Confidence Interval", value: "i" }
  ];

  let samplesAreDependent = false;
  let mutableSamples = [];
  let differenceSample: VarSeries;

  mutableSamplesStore.subscribe((value) => {
    mutableSamples = value;
    if (value.length != 0) {
      differenceSample = getDifferenceSample(
        mutableSamples[0],
        mutableSamples[1]
      );
    }
  });
</script>

<div class="flex space-x-4 py-8 flex-row flex-grow">
  <span class="text-2xl font-medium">Samples are independent</span>
  <Checkbox
    name="subscribe"
    checked={samplesAreDependent}
    title="Select to subscribe!"
    on:change={() => {
      samplesAreDependent = !samplesAreDependent;
    }}
    round
  />
</div>
<div class="grid grid-cols-3 gap-4">
  {#if mutableSamples.length != 0}
    <div>
      <Table {headers} items={updateSampleTable(mutableSamples[0])} />
    </div>
    <div>
      <Table {headers} items={updateSampleTable(mutableSamples[1])} />
    </div>
    {#if samplesAreDependent}
      <div>
        <Table {headers} items={updateSampleTable(differenceSample)} />
      </div>
    {/if}
  {/if}
</div>
