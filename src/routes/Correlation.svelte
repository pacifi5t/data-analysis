<script lang="ts">
  import { Table } from "attractions";
  import { mutableSamplesStore } from "../utils/stores";
  import {
    determineCorrelation,
    pretty,
    prettyToPrecision
  } from "../utils/helpers";
  import * as mymath from "../math";

  const headers = [
    { text: "coeffcient", value: "coef" },
    { text: "estimate", value: "estimate" },
    { text: "conf. interval", value: "conf" },
    { text: "statistic", value: "stat" },
    { text: "quantile", value: "quan" },
    { text: "significant?", value: "sign" },
    { text: "correlation?", value: "corr" }
  ];

  let mutableSamples: mymath.VarSeries[] = [];
  let tableItems = [];

  mutableSamplesStore.subscribe((value: mymath.VarSeries[]) => {
    mutableSamples = value;
    if (value.length != 0) {
      tableItems = updateCorrelationTable(
        mutableSamples[0].initialArray,
        mutableSamples[1].initialArray
      );
    }
  });

  export function updateCorrelationTable(arrX: number[], arrY: number[]) {
    const len = arrX.length;
    const {
      array: rankArray,
      duplicatesX,
      duplicatesY
    } = mymath.arraysToRankArray(arrX, arrY);
    const items = [];

    const pearson = mymath.pearsonCorrelationEstimate(arrX, arrY);
    const pearsonInterval = mymath.pearsonCorrelationInterval(len, pearson);
    const tStat1 = mymath.tStatistic(len, pearson);
    const studentQuan1 = mymath.studentDistribQuan(
      1 - mymath.alpha / 2,
      len - 2
    );
    items.push({
      coef: "Pearson",
      estimate: prettyToPrecision(pearson, 7),
      conf: `${pretty(pearsonInterval[0])} ; ${pretty(pearsonInterval[1])}`,
      stat: `t = ${pretty(tStat1)}`,
      quan: `Student = ${pretty(studentQuan1)}`,
      sign: Math.abs(tStat1) > studentQuan1 ? "Yes" : "No",
      corr: determineCorrelation(pearson)
    });

    const spearman = mymath.spearmanCorrelationEstimate(
      rankArray,
      duplicatesX,
      duplicatesY
    );
    const tStat2 = mymath.tStatistic(len, spearman);
    const studentQuan2 = mymath.studentDistribQuan(
      1 - mymath.alpha / 2,
      len - 2
    );
    items.push({
      coef: "Spearman",
      estimate: prettyToPrecision(spearman, 7),
      conf: "-",
      stat: `t = ${pretty(tStat2)}`,
      quan: `Student = ${pretty(studentQuan2)}`,
      sign: Math.abs(tStat2) > studentQuan2 ? "Yes" : "No",
      corr: determineCorrelation(spearman)
    });

    const kendall = mymath.kendallCorrelationEstimate(
      rankArray,
      duplicatesX,
      duplicatesY
    );
    const uStat = mymath.uStatistic(len, kendall);
    const normQuan = mymath.normDistribQuan(1 - mymath.alpha / 2);
    items.push({
      coef: "Kendall",
      estimate: prettyToPrecision(kendall, 7),
      conf: "-",
      stat: `u = ${pretty(uStat)}`,
      quan: `Normal = ${pretty(normQuan)}`,
      sign: Math.abs(uStat) > normQuan ? "Yes" : "No",
      corr: determineCorrelation(kendall)
    });

    const correlationArray = mymath.correlationRatioTransformation(arrX, arrY);
    const ratio = mymath.correlationRatioEstimate(len, correlationArray);
    const classCount = correlationArray.x.length;
    const fStat = mymath.fStatistic(len, classCount, ratio);
    const fisherQuan = mymath.fisherDistribQuan(
      1 - mymath.alpha,
      classCount - 2,
      len - classCount
    );
    items.push({
      coef: "Correlation ratio",
      estimate: prettyToPrecision(ratio, 7),
      conf: "-",
      stat: `f = ${pretty(fStat)}`,
      quan: `Fisher = ${pretty(fisherQuan)}`,
      sign: Math.abs(fStat) > fisherQuan ? "Yes" : "No",
      corr: determineCorrelation(ratio)
    });

    return items;
  }
</script>

{#if mutableSamples.length != 0}
  <Table class="pb-8 mx-2" {headers} items={tableItems} />
{/if}
