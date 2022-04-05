import Layout from "./Layout.svelte";
import DataUpload from "./routes/DataUpload.svelte";
import Characteristics from "./routes/Characteristics.svelte";
import Correlation from "./routes/Correlation.svelte";

class Route {
  name: string;
  component: unknown;
  layout: typeof Layout;

  constructor(name: string, component: unknown) {
    this.name = name;
    this.component = component;
    this.layout = Layout;
  }
}

export const routes = [
  new Route("/", DataUpload),
  new Route("/chars", Characteristics),
  new Route("/correlation", Correlation)
];
