const request = require("supertest");
import { app } from "../app";

var Mongoose = require("mongoose").Mongoose;
var mongoose = new Mongoose();

var MockMongoose = require("mock-mongoose").MockMongoose;
var mockMongoose = new MockMongoose(mongoose);

describe("Test edite and delete user", () => {
  test("Deve permiter que o usuario edite seu perfil", () => {
    return request(app)
      .post("/edite")
      .set("Content-Type", "Application/json")
      .send({
        email: "joaozinho@gmail.com",
        username: "joaozinho",
        city: "Cajazeiras",
        road: "Jose leoncio da silva",
        district: "Jardim Oasis",
        zip: "58900-000",
      })
      .then((response) => {
        expect(response.statusCode).toBe(302);
        expect(response.text).toMatch(/Found. Redirecting to \//i);
      });
  });

  test("deve permitir que o usuario exclua perfil", () => {
    return request(app)
      .post("/delete")
      .set("Content-Type", "Application/json")
      .send({
        email: "joaozinho@gmail.com",
      })
      .then((response) => {
        expect(response.statusCode).toBe(302);
        expect(response.text).toMatch(/Found. Redirecting to \//i);
      });
  });
});
