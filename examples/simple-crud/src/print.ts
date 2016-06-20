import { schema } from "./schema";
const printSchema = require("graphql/utilities").printSchema;

function main() {
    console.log(printSchema(schema));
}

main();
