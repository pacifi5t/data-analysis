import express from 'express';
import cors from 'cors';
import { resolve } from 'path';

const app = express();
const distPath = resolve('dist') + '/';

app.use(cors());
app.use(express.static(distPath));

app.use('/', (_req, res) => {
  res.status(200).sendFile(distPath + 'index.html');
});

async function start(port) {
  try {
    app.listen(port, () =>
      console.log(`App started on port http://localhost:${port}/`)
    );
  } catch (err) {
    console.error(err);
  }
}

start(5000);
