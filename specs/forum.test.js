const request = require("supertest");
import { app } from "../app";

describe("Test Forum", () => {
  test("Lista usuarios ma pagina forum", () => {
    return request(app)
    .get("/user/forum")
    .then((response) => {
      expect(response.statusCode).toBe(302);
    });
  });
 
  test("não deve permitir envio de mensagem", async() => {
    return request(app)
      .post("/user/forum")
      .set("Content-Type", "Application/json")
        .send({
          msg: "O senhor é meu Pastor",
        }).then((response) => {
          expect(response.statusCode).toBe(302);
          expect(response.text).toMatch(/\//);
        });
  });
});


  