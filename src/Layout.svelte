<script lang="ts">
  export let currentRoute;

  import {Route} from 'svelte-router-spa';
</script>

<Route {currentRoute}/>