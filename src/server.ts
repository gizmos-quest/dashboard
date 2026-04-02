import { createServer } from "node:http";
import { router, notFound, staticFile } from "./entry.node-server";

const port = parseInt(process.env.PORT || "3000");

const server = createServer((req, res) => {
  staticFile(req, res, () => {
    router(req, res, () => {
      notFound(req, res, () => {});
    });
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
