<script lang="ts">
  import { Checkbox, Table } from "attractions";
  import * as mymath from "../math";
  import { getDifferenceSample, updateSampleTable } from "../utils/helpers";
  import { mutableSamplesStore } from "../utils/stores";

  const headers = [
    { text: "", value: "t" },
    { text: "Value", value: "v" },
    { text: "Standard Deviation", value: "d" },
    { text: "Confidence Interval", value: "i" }
  ];

  const messages = [
    "Sample distribution is normal",
    "Sample distribution is not normal"
  ];

  let samplesAreDependent = false;
  let mutableSamples: mymath.VarSeries[] = [];
  let differenceSample: mymath.VarSeries;
  let isNormal: boolean[];

  mutableSamplesStore.subscribe((value) => {
    mutableSamples = value;
    if (value.length != 0) {
      differenceSample = getDifferenceSample(
        mutableSamples[0],
        mutableSamples[1]
      );
      isNormal = [
        mymath.identifyNormalDistribEx(mutableSamples[0]),
        mymath.identifyNormalDistribEx(mutableSamples[1]),
        mymath.identifyNormalDistribEx(differenceSample)
      ];
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
  {#if mutableSamples.length != 0 && isNormal !== undefined}
    <div>
      {#if isNormal[0]}
        <span>{messages[0]}</span>
      {:else}
        <span>{messages[1]}</span>
      {/if}
      <Table {headers} items={updateSampleTable(mutableSamples[0])} />
    </div>
    <div>
      {#if isNormal[1]}
        <span>{messages[0]}</span>
      {:else}
        <span>{messages[1]}</span>
      {/if}
      <Table {headers} items={updateSampleTable(mutableSamples[1])} />
    </div>
    {#if samplesAreDependent}
      <div>
        {#if isNormal[2]}
          <span>{messages[0]}</span>
        {:else}
          <span>{messages[1]}</span>
        {/if}
        <Table {headers} items={updateSampleTable(differenceSample)} />
      </div>
    {/if}
  {/if}
</div>
