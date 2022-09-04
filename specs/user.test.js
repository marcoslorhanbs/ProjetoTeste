const request = require("supertest");
import { app } from "../app";

jest.mock("../App/controller/userControll", () => ({
  createUser: jest
    .fn(async (userData) => {
      return true;
    })
    .mockImplementationOnce(async (userData) => {
      return false;
    }),
}));

// jest.mock("../App/data/redis", () => ({
//   redisClient: jest.fn(),
// }));

// jest.mock("../App/data/neo4j", () => ({
//   driver: jest.fn(),
// }));

var Mongoose = require("mongoose").Mongoose;
var mongoose = new Mongoose();

var MockMongoose = require("mock-mongoose").MockMongoose;
var mockMongoose = new MockMongoose(mongoose);

// beforeAll(function (done) {
//   mockMongoose.prepareStorage().then(function () {
//     mongoose.connect("mongodb://example.com/TestingDB", function (err) {
//       done(err);
//     });
//   });
// });

// // afterAll(async function (done) {
// //   await mongoose.disconnect();
// //   done();
// // });

describe("Testes de cadastro", () => {
  test("não deve permitir o cadastro de usuario quando ja existir", async () => {
    await request(app)
      .post("/register")
      .set("Content-Type", "Application/json")
      .send({
        firstName: "a",
        lastName: "a",
        age: "22",
        username: "aa",
        blood: "A+",
        email: "a@b.com",
        password: "aaa",
        city: "a",
        road: "b",
        district: "c",
        zip: "d",
      })
      .then((response) => {
        expect(response.statusCode).toBe(302);
        expect(response.text).toMatch(/Found. Redirecting to \/register/i);
      });
  });
  test("deve permitir o cadastro de usuario", async () => {
    await request(app)
      .post("/register")
      .set("Content-Type", "Application/json")
      .send({
        firstName: "a",
        lastName: "a",
        age: "22",
        username: "aa",
        blood: "A+",
        email: "a@b.com",
        password: "aaa",
        city: "a",
        road: "b",
        district: "c",
        zip: "d",
      })
      .then((response) => {
        expect(response.statusCode).toBe(302);
        expect(response.text).toMatch(/Found. Redirecting to login/i);
      });
  });
});

describe("Test the path root", () => {
  test("Deve responder o método GET com um 200", () => {
    return request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});

describe("Testa o path tech", () => {
  test("Deve responder o metodo GET com um 302 (não authenticado - redireciona para login)", () => {
    return request(app)
      .get("/tech")
      .then((response) => {
        expect(response.statusCode).toBe(302);
      });
  });
});

describe("Testa o path profile", () => {
  test("Listas usuarios", async () => {
    expect((res) => {
      return request(app).get("/user").expect(res.statusCode).toBe(200);
    });
  });
});

