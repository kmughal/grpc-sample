const PROTO_PATH = __dirname + "/protos/greetings.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const routeGuide = grpc.loadPackageDefinition(packageDefinition);

function sayHello(call, callback) {
  callback(null, { message: "Hello " + call.request.name });
}

function sayHelloAgain(call, callback) {
  callback(null, { message: "Hello again, " + call.request.name });
}

const bigJson = require("big-json");
const { createReadStream } = require("fs");
const path = require("path");

const readStream = createReadStream(path.resolve(__dirname, "data.json"));
const jsonStream = bigJson.createParseStream();

function getStreamData(call, callback) {
  jsonStream.on("data", (data) => {
    for (let i in data) {
      call.write(data[i]);
    }
    call.end();
  });
  readStream.pipe(jsonStream);
}

function main() {
  const server = new grpc.Server();

  server.addService(routeGuide.Greeter.service, {
    sayHello,
    sayHelloAgain,
    getStreamData,
  });

  server.bindAsync(
    "0.0.0.0:5001",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("starting server : 5001");
    }
  );
}

main();
