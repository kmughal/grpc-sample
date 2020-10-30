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


const bigJson = require("big-json");
const { createReadStream } = require("fs");
const path = require("path");

const readStream = createReadStream(path.resolve(__dirname, "data.json"));
const parseJons = bigJson.createParseStream();

function getStreamData(call, callback) {
  parseJons.on("data", (data) => {
    for(let i in data) {
      call.write(data[i]);
    }
   call.end();
  });
  readStream.pipe(parseJons);
 
}

function main() {
  const server = new grpc.Server();
  server.addService(routeguide.Greeter.service, {
    sayHello,
    sayHelloAgain,
    getStreamData,
  });
  server.bind("0.0.0.0:5001", grpc.ServerCredentials.createInsecure());
  server.start();
  console.log("starting server : 5001");
}

main();
