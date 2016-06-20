npm run test

if [ "$?" -gt 0 ]; then
  exit 1
fi

pushd examples/hello-world/

npm install
npm start

if [ "$?" -gt 0 ]; then
  exit 1
fi
popd

pushd examples/simple-crud

npm install
npm run print

if [ "$?" -gt 0 ]; then
  exit 1
fi
popd

exit 0
