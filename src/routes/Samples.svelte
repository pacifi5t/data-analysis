<script lang="ts">
  import { Checkbox, Table } from "attractions";
  import * as mymath from "../math";
  import {
    getDifferenceSample,
    pretty,
    updateSampleTable
  } from "../utils/helpers";
  import { mutableSamplesStore } from "../utils/stores";

  function getResult() {
    resItems = [];
    if (isNormal[0] && isNormal[1]) {
      const res1 = mymath.dispersionEq(
        mutableSamples[0].initialArray,
        mutableSamples[1].initialArray
      );
      resItems.push({
        t: "Dispersion equality",
        r: res1[0],
        s: "f = " + pretty(res1[1])
      });
      if (samplesAreDependent) {
        const res2 = mymath.depMeanEq(
          mutableSamples[0].initialArray,
          mutableSamples[1].initialArray
        );
        resItems.push({
          t: "Dep. mean equality",
          r: res2[0],
          s: "t = " + pretty(res2[1])
        });
      } else {
        const res2 = mymath.indepMeanEq(
          mutableSamples[0].initialArray,
          mutableSamples[1].initialArray,
          !res1[0]
        );
        resItems.push({
          t: "Indep. mean equality",
          r: res2[0],
          s: "t = " + pretty(res2[1])
        });
      }
    }

    if (samplesAreDependent) {
      const res3 = mymath.testWilcoxonSignedRank(
        mutableSamples[0].initialArray,
        mutableSamples[1].initialArray
      );
      resItems.push({
        t: "Wilcoxon signed rank",
        r: res3[0],
        s: "u = " + pretty(res3[1])
      });
    } else {
      const res3 = mymath.testMannWhitney(
        mutableSamples[0].initialArray,
        mutableSamples[1].initialArray
      );
      resItems.push({
        t: "Mann-Whitney",
        r: res3[0],
        s: "u = " + pretty(res3[1])
      });
    }
  }

  const headers = [
    { text: "", value: "t" },
    { text: "Value", value: "v" },
    { text: "Standard Deviation", value: "d" },
    { text: "Confidence Interval", value: "i" }
  ];

  const resHeaders = [
    { text: "Criteria", value: "t" },
    { text: "Result", value: "r" },
    { text: "Statistic", value: "s" }
  ];

  const messages = [
    "Sample distribution is normal",
    "Sample distribution is not normal"
  ];

  let samplesAreDependent = false;
  let mutableSamples: mymath.VarSeries[] = [];
  let differenceSample: mymath.VarSeries;
  let isNormal: boolean[];
  let resItems = [];

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
      // console.log(
      //   mymath.identifyNormalDistrib(mutableSamples[0].initialArray),
      //   mymath.identifyNormalDistrib(mutableSamples[1].initialArray)
      // );

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
<Table headers={resHeaders} items={resItems} />
