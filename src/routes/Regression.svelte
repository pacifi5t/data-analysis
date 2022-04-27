<script lang="ts">
  import { Button, Dropdown, DropdownShell, Table } from "attractions";
  import { attributesStore, mutableSamplesStore } from "../utils/stores";
  import { scatterPlotRegression } from "../utils/charts";
  import { pretty } from "../utils/helpers";
  import { onMount } from "svelte";
  import * as mymath from "../math";
  import { alpha } from "../math";

  const headers = [
    { text: "", value: "title" },
    { text: "Parameter", value: "parameter" },
    { text: "Std. Deviation", value: "stddev" },
    { text: "Conf. Interval", value: "conf" },
    { text: "t-statistic", value: "stat" },
    { text: "Significant?", value: "sign" }
  ];

  const headers2 = [
    { text: "Remains dispersion", value: "disp" },
    { text: "Determination coefficient", value: "coef" },
    { text: "f-statistic", value: "stat" },
    { text: "Skewness coef.", value: "skew" },
    { text: "Kurtosis coef.", value: "kurt" },
    { text: "Student quan.", value: "stud" },
    { text: "Fisher quan", value: "fish" },
    { text: "Is normal?", value: "norm" },
    { text: "Is significant?", value: "sign" }
  ];

  const attributes: string[] = $attributesStore;
  const seriesArray: mymath.VarSeries[] = $mutableSamplesStore;

  let attrIndex = 0;
  let items = [];
  let items2 = [];
  let parameters: number[] = [];

  if (attributes.length != 0) {
    updateTable();
  }

  onMount(() => {
    if (seriesArray.length != 0) {
      scatterPlotRegression(
        seriesArray[attrIndex].initialArray,
        seriesArray.at(-1).initialArray,
        parameters[0],
        parameters[1]
      );
    }
  });

  function updateTable() {
    const arrX = seriesArray[attrIndex].initialArray;
    const arrY = seriesArray.at(-1).initialArray;

    items = [];
    items2 = [];
    parameters = [];

    parameters.push(mymath.linearA0(arrX, arrY));
    parameters.push(mymath.linearA1(arrX, arrY));

    const eArray = [];
    for (let i = 0; i < seriesArray[attrIndex].length; i++) {
      eArray.push(
        arrY[i] - mymath.linearFn2(arrX[i], parameters[0], parameters[1])
      );
    }

    const sse = eArray.reduce((total, value) => total + value * value, 0);
    const remainsDispersion = sse / (arrX.length - parameters.length - 1);
    const dispArray = [
      mymath.dispersionA0(arrX, remainsDispersion),
      mymath.dispersionA1(arrX, remainsDispersion)
    ];
    const confArray = [
      mymath.paramConfInterval(parameters[0], dispArray[0], arrX.length),
      mymath.paramConfInterval(parameters[1], dispArray[1], arrX.length)
    ];
    const tStatArray = [
      mymath.regressionTStat(parameters[0], dispArray[0]),
      mymath.regressionTStat(parameters[1], dispArray[1])
    ];

    const studentQuan = mymath.studentDistribQuan(
      1 - mymath.alpha / 2,
      arrX.length - parameters.length - 1
    );

    for (let i = 0; i < 2; i++) {
      items.push({
        title: `a${i}`,
        parameter: pretty(parameters[i]),
        stddev: pretty(Math.sqrt(dispArray[i])),
        conf: `${pretty(confArray[i][0])} ; ${pretty(confArray[i][1])}`,
        stat: pretty(tStatArray[i]),
        sign: Math.abs(tStatArray[i]) > studentQuan
      });
    }

    const determinationCoef = mymath.determinationCoef(
      arrY,
      remainsDispersion,
      parameters.length
    );
    const fstat = mymath.regressionFStat(
      determinationCoef,
      arrY.length,
      parameters.length
    );
    const eMean = mymath.mean(eArray);
    const eShiftedDev = mymath.shiftedDeviation(eArray, eMean);
    const skew = mymath.skewnessCoef(eArray, eShiftedDev, eMean);
    const kurt = mymath.kurtosisCoef(eArray, eShiftedDev, eMean);
    const studentQuan2 = mymath.studentDistribQuan(
      1 - alpha / 2,
      eArray.length - parameters.length - 1
    );
    const fisherQuan = mymath.fisherDistribQuan(
      1 - alpha / 2,
      parameters.length,
      arrX.length - parameters.length - 1
    );

    items2.push({
      disp: pretty(remainsDispersion),
      coef: pretty(determinationCoef),
      stat: pretty(fstat),
      skew: pretty(skew),
      kurt: pretty(kurt),
      stud: pretty(studentQuan2),
      fish: pretty(fisherQuan),
      sign: fstat > fisherQuan,
      norm: studentQuan2 > Math.abs(skew) && studentQuan2 > Math.abs(kurt)
    });
  }
</script>

{#if attributes.length != 0}
  <div class="flex gap-8">
    <div class="flex-col w-80">
      <div class="flex gap-4">
        <span class="text-xl py-2">Independent attribute:</span>
        <DropdownShell let:toggle>
          <Button on:click={toggle}>{attributes[attrIndex] ?? ""}</Button>
          <Dropdown>
            <div class="p-2">
              {#each attributes.slice(0, -1) as a, i}
                <Button
                  on:click={() => {
                    attrIndex = i;
                    updateTable();
                    scatterPlotRegression(
                      seriesArray[attrIndex].initialArray,
                      seriesArray.at(-1).initialArray,
                      parameters[0],
                      parameters[1]
                    );
                  }}
                >
                  {a}
                </Button>
              {/each}
            </div>
          </Dropdown>
        </DropdownShell>
      </div>
      <div class="flex gap-4">
        <span class="text-xl py-2"> Target attribute: </span>
        <div
          class="py-3 font-medium"
          style="color: #ff3e00; font-family: sans-serif;"
        >
          {attributes.at(-1)}
        </div>
      </div>
    </div>
    <Table {headers} {items} />
  </div>
  <div id="regression" class="py-8" />
  <Table headers={headers2} items={items2} />
{/if}
