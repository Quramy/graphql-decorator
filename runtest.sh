#!/bin/sh

set -e

yarn run test
./node_modules/.bin/rimraf node_modules
yarn install --production

# Hellow World
cd examples/hello-world/
yarn install
yarn start
cd ../../

# Simple CRUD
cd examples/simple-crud
yarn install
yarn run print
cd ../../

# Restore lib environment
yarn install

exit 0
