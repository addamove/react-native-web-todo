const fs = require("fs");
// Require the framework and instantiate it
const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("fastify-cors"), {
  origin: (origin, cb) => {
    if (/localhost/.test(origin)) {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"));
  },
});

// Declare a route
fastify.get("/items", function (request, reply) {
  let content = fs
    .readFileSync(process.cwd() + "/server/" + "items.json")
    .toString();
  reply.send(content);
});

// Declare a route
fastify.post("/item", function (request, reply) {
  const rawData = fs.readFileSync(process.cwd() + "/server/" + "items.json");
  const data = JSON.parse(rawData);
  const updatedData = [request.body, ...data];
  fs.writeFileSync(
    process.cwd() + "/server/" + "items.json",
    JSON.stringify(updatedData)
  );
  reply.send(updatedData);
});

fastify.put("/item/:id", function (request, reply) {
  const id = request.params.id;
  const rawData = fs.readFileSync(process.cwd() + "/server/" + "items.json");
  const data = JSON.parse(rawData);
  const newData = data.map((item) =>
    item.id === id ? { ...item, ...request.body } : item
  );
  fs.writeFileSync(
    process.cwd() + "/server/" + "items.json",
    JSON.stringify(newData)
  );
  reply.send(newData);
});

fastify.delete("/item/:id", function (request, reply) {
  const id = request.params.id;
  const rawData = fs.readFileSync(process.cwd() + "/server/" + "items.json");
  const data = JSON.parse(rawData);
  const updatedData = data.filter((item) => item.id !== id);
  fs.writeFileSync(
    process.cwd() + "/server/" + "items.json",
    JSON.stringify(updatedData)
  );
  reply.send(updatedData);
});

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
