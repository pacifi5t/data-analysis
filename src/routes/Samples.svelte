<script lang="ts">
  import { Checkbox, Table } from "attractions";
  import * as mymath from "../math";
  import { getDifferenceSample, updateSampleTable } from "../utils/helpers";
  import { mutableSamplesStore } from "../utils/stores";

  function getResult() {
    output1 = "";
    output2 = "";
    if (isNormal[0] && isNormal[1]) {
      if (samplesAreDependent) {
        const res1 = mymath.testWilcoxonSignedRank(
          mutableSamples[0].initialArray,
          mutableSamples[1].initialArray
        );

        const res2 = mymath.depMeanEq(
          mutableSamples[0].initialArray,
          mutableSamples[1].initialArray
        );
        output1 += `Wilcoxon signed rank: ${res1[0]}, u = ${res1[1]}`;
        output2 += `Dep mean test: ${res2[0]}, p = ${res2[1]}\n`;
      } else {
        const res1 = mymath.indepMeanEq(
          mutableSamples[0].initialArray,
          mutableSamples[1].initialArray
        );

        const res2 = mymath.dispersionEq(
          mutableSamples[0].initialArray,
          mutableSamples[1].initialArray
        );
        output1 += `Indep mean test: ${res1[0]}, p = ${res1[1]}\n`;
        output2 += `Dispersion test: ${res2[0]}, F = ${+res2[1]}\n`;
      }
    } else {
      if (samplesAreDependent) {
        const res1 = mymath.testWilcoxonSignedRank(
          mutableSamples[0].initialArray,
          mutableSamples[1].initialArray
        );

        const res2 = mymath.depMeanEq(
          mutableSamples[0].initialArray,
          mutableSamples[1].initialArray
        );
        output1 += `Wilcoxon signed rank: ${res1[0]}, u = ${res1[1]}`;
        output2 += `Dep mean test: ${res2[0]}, p = ${res2[1]}\n`;
      } else {
        const res = mymath.testMannWhitney(
          mutableSamples[0].initialArray,
          mutableSamples[1].initialArray
        );
        output1 += `Mann-Whitney test: ${res[0]}, u = ${res[1]}`;
      }
    }
  }

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
  let output1 = "";
  let output2 = "";

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

      getResult();
    }
  });
</script>

<div class="flex space-x-4 py-8 flex-row flex-grow">
  <span class="text-2xl font-medium">Samples are dependent</span>
  <Checkbox
    name="subscribe"
    checked={samplesAreDependent}
    title="Select to subscribe!"
    on:change={() => {
      samplesAreDependent = !samplesAreDependent;
      getResult();
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
<p class="text-2xl pt-4 font-medium">{output1}</p>
<p class="text-2xl font-medium">{output2}</p>
