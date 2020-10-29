const PROTO_PATH = __dirname + "/protos/greetings.proto";
const grpc = require("grpc");
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
}

main();
