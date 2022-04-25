<script lang="ts">
  import { Button, Dropdown, DropdownShell, Table } from "attractions";
  import { attributesStore, mutableSamplesStore } from "../utils/stores";
  import type * as mymath from "../math";

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

  for (let i = 0; i < 2; i++) {}
</script>

{#if $attributesStore.length != 0}
  <div class="flex gap-8">
    <div class="flex-col w-80">
      <div class="flex gap-4">
        <span class="text-xl py-2">Independent attribute:</span>
        <DropdownShell let:toggle>
          <Button on:click={toggle}>{attributes[attrIndex] ?? ""}</Button>
          <Dropdown>
            <div class="p-2">
              {#each attributes.slice(0, -1) as a, i}
                <Button on:click={() => (attrIndex = i)}>{a}</Button>
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
    <Table {headers} />
  </div>
{/if}
