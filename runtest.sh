npm run test

if [ "$?" -gt 0 ]; then
  exit 1
fi

cd examples/hello-world/

npm install
npm start

if [ "$?" -gt 0 ]; then
  exit 1
fi
cd ../../

cd examples/simple-crud

npm install
npm run print

if [ "$?" -gt 0 ]; then
  exit 1
fi
cd ../../

exit 0
