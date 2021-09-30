<script lang="ts">
  export let currentRoute;

  import { Route } from 'svelte-router-spa';
  import NavItem from './components/NavItem.svelte';
</script>

<nav class="bg-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <img class="h-8 w-8" src="/svelte.png" alt="Svelte" />
        </div>
        <div class="md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <NavItem label="Data upload" href="/" {currentRoute} />
            <NavItem label="Plots" href="/plots" {currentRoute} />
            <NavItem label="Metrics" href="/metrics" {currentRoute} />
            <NavItem label="Anomalies" href="/anomalies" {currentRoute} />
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>

<main>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <Route {currentRoute} />
  </div>
</main>
