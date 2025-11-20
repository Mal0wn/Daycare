// Main Express bootstrap configuring middleware + API routes.
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { initStores } = require('./services/storeRegistry');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.get('/', (_req, res) => res.json({ message: 'API Daycare' }));
app.use('/api', routes);
app.use(errorHandler);

initStores()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API prête sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Impossible de démarrer le serveur', error);
    process.exit(1);
  });
