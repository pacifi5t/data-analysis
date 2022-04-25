<script lang="ts">
  import { Button, Dropdown, DropdownShell, Table } from "attractions";
  import { attributesStore, mutableSamplesStore } from "../utils/stores";
  import { pretty } from "../utils/helpers";
  import * as mymath from "../math";

  const headers = [
    { text: "", value: "title" },
    { text: "Parameter", value: "parameter" },
    { text: "Std. Deviation", value: "stddev" },
    { text: "Conf. Interval", value: "conf" },
    { text: "Statistic", value: "stat" },
    { text: "p-value", value: "p" },
    { text: "Significant?", value: "sign" }
  ];

  const attributes: string[] = $attributesStore;
  const seriesArray: mymath.VarSeries[] = $mutableSamplesStore;

  let attrIndex = 0;
  let items = [];
  let parameters: number[] = [];

  if (attributes.length != 0) {
    updateTable();
  }

  function updateTable() {
    
    items = [];
    parameters = [];

    parameters.push(
      mymath.linearA0(
        seriesArray[attrIndex].initialArray,
        seriesArray.at(-1).initialArray
      )
    );

    parameters.push(
      mymath.linearA1(
        seriesArray[attrIndex].initialArray,
        seriesArray.at(-1).initialArray
      )
    );

    for (let i = 0; i < 2; i++) {
      //TODO: Add other characteristics
      items.push({
        title: `a${i}`,
        parameter: pretty(parameters[i]),
        stddev: "",
        conf: "",
        stat: "",
        p: "",
        sign: ""
      });
    }
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
{/if}
