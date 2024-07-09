const PROTO_PATH = __dirname + "/protos/greetings.proto";
const grpc = require("@grpc/grpc-js");
const loader = require("@grpc/proto-loader");

const packageDefinition = loader.loadSync(PROTO_PATH, {
  keepCase: true,
  enums: String,
  longs: String,
  defaults: true,
  oneofs: true,
});

const routeguide = grpc.loadPackageDefinition(packageDefinition);

function main() {
  const client = new routeguide.Greeter(
    "localhost:5001",
    grpc.credentials.createInsecure()
  );

  client.sayHello({ name: "khurram" }, (err, response) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(response);
  });

  console.log("calling line status");
  const stream = client.getStreamData({ name: "khurram" });
  stream.on("data", (err, response) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(response);
  });

  stream.on("end", () => {
    console.log("finisehd stream");
  });
}

main();
