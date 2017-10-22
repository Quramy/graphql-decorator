import * as express from 'express';
import * as bodyParser from 'body-parser';
import { createServer, Server } from 'http';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe, printSchema } from 'graphql';
import * as cors from 'cors';


export default function startGraphQLServer(
	schema,
	domain = 'localhost',
	port = process.env.PORT,
	path = '/graphql',
) {
	const PORT = port;
	// const myGraphQLSchema: any = schema; // ... define or import your schema here!

	const app: express.Express = express();

	// bodyParser is needed just for POST.
	app.use('/', cors(), bodyParser.json(), graphqlExpress({ schema }));

	app.get('/debug', graphiqlExpress({
		endpointURL: '/',
		editorTheme: '',
		subscriptionsEndpoint: `ws://${domain}:${PORT}/subscriptions`,
	})); // if you want GraphiQL enabled

	app.get('/schema', (req, res) => {
		const schemaString = printSchema(schema);

		res.write(schemaString);
		res.end();
	});

	const ws: Server = createServer(app);

	ws.listen(PORT, () => {
		console.log(`GraphQL Server is now running on http://${domain}:${PORT}`);

		// set up the WebSocket for handling GraphQL subscriptions
		const sub: SubscriptionServer = new SubscriptionServer({
			execute,
			subscribe,
			schema,
		}, { server: ws, path: '/subscriptions' });
	});
}
