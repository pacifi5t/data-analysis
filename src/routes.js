import Layout from './Layout.svelte';
import DataUpload from './routes/DataUpload.svelte';
import Plots from './routes/Plots.svelte';
import Metrics from './routes/Metrics.svelte';
import Anomalies from './routes/Anomalies.svelte';

class Route {
  /**
   * @param {string} name
   */
  constructor(name, component) {
    this.name = name;
    this.component = component;
    this.layout = Layout;
  }
}

export const routes = [
  new Route('/', DataUpload),
  new Route('/plots', Plots),
  new Route('/metrics', Metrics),
  new Route('/anomalies', Anomalies)
];
