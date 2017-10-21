import * as express from 'express';
import * as bodyParser from 'body-parser';
import { createServer, Server } from 'http';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import * as graphql from 'graphql';
import * as cors from 'cors';


export default function startGraphQLServer(schema, domain = 'localhost', port = process.env.PORT) {
	const PORT = port;
	const myGraphQLSchema: any = schema; // ... define or import your schema here!

	const app: express.Express = express();

	// bodyParser is needed just for POST.
	app.use('/graphql', cors(), bodyParser.json(), graphqlExpress({ schema: myGraphQLSchema }));
	app.get('/graphiql', graphiqlExpress({
		endpointURL: '/graphql',
		subscriptionsEndpoint: `ws://${domain}:${PORT}/subscriptions`,
	})); // if you want GraphiQL enabled

	const ws: Server = createServer(app);

	ws.listen(PORT, () => {
		console.log(`GraphQL Server is now running on http://${domain}:${PORT}`);

		// set up the WebSocket for handling GraphQL subscriptions
		const sub: SubscriptionServer = new SubscriptionServer({
			execute: graphql.execute,
			subscribe: graphql.subscribe,
			schema,
		}, { server: ws, path: '/subscriptions' });
	});
}
