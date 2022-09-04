const request = require("supertest");
import { app } from "../app";

var Mongoose = require("mongoose").Mongoose;
var mongoose = new Mongoose();

var MockMongoose = require("mock-mongoose").MockMongoose;
var mockMongoose = new MockMongoose(mongoose);

describe("Test of login", () => {
  test("Deve permitir o login do usuario", () => {
    return request(app)
      .post("/login")
      .set("Content-Type", "Application/json")
      .send({
        username: "manoel",
        password: "000",
      })
      .then((response) => {
        expect(response.statusCode).toBe(302);
        expect(response.text).toMatch(/Found. Redirecting to \/tech/i);
      });
  });

  test("Não deve permitir o login do usuario", async () => {
    return request(app)
      .post("/login")
      .set("Content-Type", "Application/json")
      .send({
        username: "joaozinho",
        password: "123654",
      })
      .then((response) => {
        expect(response.statusCode).toBe(302);
        expect(response.text).toMatch(/Found. Redirecting to \/login/i);
      });
  });

});