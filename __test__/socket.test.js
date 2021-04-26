const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("my awesome project", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("Testing socket Client side", (done) => {
    clientSocket.on("clientTest", (arg) => {
      expect(arg).toBe("smileSquad");
      done();
    });
    serverSocket.emit("clientTest", "smileSquad");
  });

  test("Testing socket Server side", (done) => {
    serverSocket.on("serverTest", (arg) => {
      expect(arg).toBe("smileSquad");
      done();
    });
    clientSocket.emit("serverTest", "smileSquad");
  });
});