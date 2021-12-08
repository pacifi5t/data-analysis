import Layout from "./Layout.svelte";
import DataUpload from "./routes/DataUpload.svelte";
import Samples from "./routes/Samples.svelte";
import Characteristics from "./routes/Characteristics.svelte";
import PGP from "./routes/PGP.svelte";

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
  new Route("/", DataUpload),
  new Route("/samples", Samples),
  new Route("/characteristics", Characteristics),
  new Route("/pgp", PGP)
];
