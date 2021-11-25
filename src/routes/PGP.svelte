<script lang="ts">
  import {
    classifiedDataStore,
    mutableDataStore,
    normalDistributionFlagStore
  } from "../utils/stores";
  import { onMount } from "svelte";
  import { createPGPchart } from "../utils/charts";
  import { pretty } from "../utils/helpers";
  import * as mymath from "../math";

  let mutableSeries = $mutableDataStore;
  let classifiedData = $classifiedDataStore;
  let uA = 0;
  let uE = 0;
  let p = 1;
  let hi2 = 0;
  let isNormal = $normalDistributionFlagStore;
  let pearsonQuantile = 0;

  onMount(() => {
    if (mutableSeries.length !== 0) {
      createPGPchart(mutableSeries, isNormal);

      const meanValue = mymath.mean(mutableSeries.initialArray);
      const shiftedDev = mymath.shiftedDeviation(
        mutableSeries.initialArray,
        meanValue
      );
      const skewness = mymath.skewnessCoef(
        mutableSeries.initialArray,
        shiftedDev,
        meanValue
      );
      const skewnessStdDev = mymath.skewnessDeviation(mutableSeries.length);
      const kurtosis = mymath.kurtosisCoef(
        mutableSeries.initialArray,
        shiftedDev,
        meanValue
      );
      const kurtosisStdDev = mymath.kurtosisDeviation(mutableSeries.length);

      uA = Math.abs(skewness / skewnessStdDev);
      uE = Math.abs(kurtosis / kurtosisStdDev);

      hi2 = mymath.hiSquare(classifiedData, mutableSeries);
      p = mymath.pearsonCriteria(
        mymath.pearsonFunction(hi2, classifiedData.classCount - 1)
      );

      pearsonQuantile = mymath.pearsonDistribQuan(
        1 - mymath.alpha,
        classifiedData.classCount - 1
      );
    }
  });
</script>

<div class="flex">
  <div>
    <div id="pgp" />
    {#if mutableSeries.length !== 0}
      <div class="mx-20">
        <p class="text-green-800">- Restored distribution function</p>
      </div>
    {/if}
  </div>
  <div class="mx-20">
    <p>u = {pretty(mymath.normQuan)}</p>
    <p>uA = {pretty(uA)}</p>
    <p>uE = {pretty(uE)}</p>
    <p class="pt-10">p = {pretty(p)}</p>
    <p>hi^2 = {pretty(hi2)}</p>
    <p>
      Pearson quantile: {pretty(pearsonQuantile)}
    </p>
    <div class="pt-10">
      {#if isNormal && hi2 <= pearsonQuantile && p >= mymath.alpha}
      <p>Distribution is normal</p>
    {:else}
      <p>Distribution is not normal</p>
    {/if}
    </div>
  </div>
</div>
