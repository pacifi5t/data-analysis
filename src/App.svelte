<script>
  import { Router } from 'svelte-router-spa';
  import { routes } from './routes';
</script>

<main id="wrapper" class="bg-gray-100">
  <Router {routes} />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
