const PROTO_PATH = __dirname + "/protos/greetings.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const routeguide = grpc.loadPackageDefinition(packageDefinition);

function sayHello(call, callback) {
  callback(null, { message: "Hello " + call.request.name });
}

function sayHelloAgain(call, callback) {
  callback(null, { message: "Hello again, " + call.request.name });
}

function main() {
  const server = new grpc.Server();
  server.addService(routeguide.Greeter.service, { sayHello, sayHelloAgain });
  server.bind("0.0.0.0:5001", grpc.ServerCredentials.createInsecure());
  server.start();
  console.log("starting server : 5001");
}

main();