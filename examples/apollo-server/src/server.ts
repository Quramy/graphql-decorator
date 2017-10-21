import startGraphQLServer from './common/apollo.server';
import schema from './schema';

startGraphQLServer(
	schema,			// our schema
	'localhost',	// for GraphiQL subscriptions
	3000, 			// development port
);
