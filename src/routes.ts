import Layout from './Layout.svelte';
import DataUpload from './routes/DataUpload.svelte';
import ECDF from './routes/ECDF.svelte';
import Classes from './routes/Classes.svelte';
import Metrics from './routes/Metrics.svelte';
import Anomalies from './routes/Anomalies.svelte';

class Route {
  name: string;
  component: typeof Layout;
  layout: typeof Layout;

  constructor(name: string, component: typeof Layout) {
    this.name = name;
    this.component = component;
    this.layout = Layout;
  }
}

export const routes = [
  new Route('/', DataUpload),
  new Route('/ecdf', ECDF),
  new Route('/classes', Classes),
  new Route('/metrics', Metrics),
  new Route('/anomalies', Anomalies)
];
