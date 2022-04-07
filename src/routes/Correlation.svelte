<script lang="ts">
  import { Table } from "attractions";
  import { mutableSamplesStore } from "../utils/stores";
  import { pretty, prettyToPrecision } from "../utils/helpers";
  import { scatterPlot } from "../utils/charts";
  import * as mymath from "../math";
  import { onMount } from "svelte";

  const headers = [
    { text: "coeffcient", value: "coef" },
    { text: "estimate", value: "estimate" },
    { text: "conf. interval", value: "conf" },
    { text: "statistic", value: "stat" },
    { text: "quantile", value: "quan" },
    { text: "significant?", value: "sign" },
    { text: "correlation?", value: "corr" }
  ];

  const headers2 = [
    { text: "pearson coefficient", value: "pearson" },
    { text: "correlation ratio", value: "ratio" },
    { text: "statistic", value: "stat" },
    { text: "quantile", value: "quan" },
    { text: "equal?", value: "equal" },
    { text: "linear?", value: "lin" }
  ];

  let mutableSamples: mymath.VarSeries[] = [];
  let tableItems = [];
  let tableItems2 = [];
  let arrX: number[];
  let arrY: number[];
  let ratioIsSignificant = false;

  mutableSamplesStore.subscribe((value: mymath.VarSeries[]) => {
    mutableSamples = value;
    if (value.length != 0) {
      [arrX, arrY] = [
        mutableSamples[0].initialArray,
        mutableSamples[1].initialArray
      ];

      const { items, pearson, ratio, stat, quan, equal } =
        updateCorrelationTable(arrX, arrY);

      tableItems = items;
      if (ratioIsSignificant) {
        tableItems2 = [
          {
            pearson: prettyToPrecision(pearson, 7),
            ratio: prettyToPrecision(ratio, 7),
            stat: pretty(stat),
            quan: pretty(quan),
            equal,
            lin: equal
          }
        ];
      }
    }
  });

  onMount(() => {
    if (mutableSamples.length != 0) {
      scatterPlot(arrX, arrY);
    }
  });

  function updateCorrelationTable(arrX: number[], arrY: number[]) {
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
      corr: Math.abs(tStat1) > studentQuan1 ? "Linear" : "No linear"
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
      corr: Math.abs(tStat2) > studentQuan2 ? "Monotone" : "Not monotonous"
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
      corr: Math.abs(uStat) > normQuan ? "Monotone" : "Not monotonous"
    });

    const correlationArray = mymath.correlationRatioTransformation(arrX, arrY);
    const ratio = mymath.correlationRatioEstimate(len, correlationArray);
    const classCount = correlationArray.x.length;
    const fStat1 = mymath.fStatistic(len, classCount, ratio);
    const fStat2 = mymath.fStatisticPearson(len, classCount, ratio, pearson);
    const fisherQuan1 = mymath.fisherDistribQuan(
      1 - mymath.alpha,
      classCount - 1,
      len - classCount
    );
    const fisherQuan2 = mymath.fisherDistribQuan(
      1 - mymath.alpha,
      classCount - 2,
      len - classCount
    );

    ratioIsSignificant = fStat1 > fisherQuan1;

    items.push({
      coef: "Correlation ratio",
      estimate: prettyToPrecision(ratio, 7),
      conf: "-",
      stat: `f = ${pretty(fStat1)}`,
      quan: `Fisher = ${pretty(fisherQuan1)}`,
      sign: ratioIsSignificant ? "Yes" : "No",
      corr: ratioIsSignificant ? "Stochastic" : "None"
    });

    return {
      items,
      pearson:
        mymath.pearsonCorrelationEstimateTransformedArray(correlationArray),
      ratio,
      stat: fStat2,
      quan: fisherQuan2,
      equal: fStat2 <= fisherQuan2 ? "Yes" : "No"
    };
  }
</script>

{#if mutableSamples.length != 0}
  <Table class="mx-2" {headers} items={tableItems} />
  {#if ratioIsSignificant}
    <Table class="py-8" headers={headers2} items={tableItems2} />
  {/if}
  <div id="scatter" class="py-8"/>
{/if}
