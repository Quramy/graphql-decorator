import startGraphQLServer from './common/apollo.server';
import schema from './schema';

startGraphQLServer(
	schema,			// our schema
	'localhost',	// for GraphiQL subscriptions
	3001, 			// development port
);
