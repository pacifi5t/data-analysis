<script lang="ts">
  export let currentRoute;

  import { Route } from "svelte-router-spa";
  import NavItem from "./NavItem.svelte";
</script>

<nav class="bg-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center h-16">
      <div class="flex-shrink-0">
        <img class="h-16 w-16" src="/stopwar.svg" alt="Svelte" />
      </div>
      <div class="md:block grow">
        <div class="ml-10 flex items-baseline space-x-4">
          <NavItem label="Data upload" href="/" {currentRoute} />
          <NavItem label="Characteristics" href="/chars" {currentRoute} />
          <NavItem label="Regression" href="/regression" {currentRoute} />
        </div>
      </div>
      <span class="text-yellow-400 text-lg font-medium">
        Glory to Ukraine!
      </span>
    </div>
  </div>
</nav>

<main>
  <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
    <Route {currentRoute} />
  </div>
</main>
