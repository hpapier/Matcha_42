const express = require('express');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const graphqlExpress = require('express-graphql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');


// Local imports.
const { PORT } = require('./config.js');
const { schema } = require('./schema.js');

const app = express();
app.use(cors());
app.use('/graphql', bodyParser.json({ limit: '5mb' }), (req, res) => graphqlExpress({ schema, graphiql: true, context: req })(req, res));

// app.use(express.static(path.resolve(__dirname, '../public')));
// --------------

const ws = createServer(app);

ws.listen(PORT, () => {
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },

    {
      server: ws,
      path: '/subscriptions'
    }
  );

  console.log(`Server listen on port ${PORT}`);
});