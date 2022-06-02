const request = require("supertest");
const app = require("../../app.js");

const validCredentials = {
  username: "tony@stark.com",
  password: "Secret#123",
};

const invalidCredentials = {
  username: "phony@stark.com",
  password: "fake#123",
};

// await request(app)
//   .post("/api/auth")
//   .send(validCredentials)
//   .then((res) => {
//     expect(res.body).toHaveProperty("token");

//     request(app)
//       .post("/api/games")
//       .send(game)
//       .then((res) => {
//         expect(res.statusCode).toBe(201);
//       });
//   });

// const game = {
//   title: "Tetris Extreme",
//   genre: "Puzzle",
//   description: "Lorem ipsum dolor",
//   releaseDate: "1990-01-01",
//   imageUrl: "https://via.placeholder.com/260x260.png?text=Game",
//   urlSlug: "tetris-extreme",
// };

describe("GET /api/games", () => {

  describe("when fetching games", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).get("/api/games").send();

      expect(response.statusCode).toBe(200);
    });

    test("should specify application/json in the content type header", async () => {
      const response = await request(app).get("/api/games").send();

      expect(response.header["content-type"]).toEqual(
        expect.stringContaining("application/json")
      );
    });

    test("should return array of games", async () => {
      const response = await request(app).get("/api/games").send();

      expect(Array.isArray(response.body)).toBe(true);

      const game = response.body[0];

      expect(game).toHaveProperty("id");
      expect(game).toHaveProperty("title");
      expect(game).toHaveProperty("genre");
      expect(game).toHaveProperty("description");
      expect(game).toHaveProperty("releaseDate");
      expect(game).toHaveProperty("imageUrl");
      expect(game).toHaveProperty("urlSlug");
    });
  });

  describe("when fetching a game", () => {

    test("should respond with a 200 status code", async () => {

      const getGame = await request(app)
        .get(`/api/games`)
        .send();

        const game = getGame.body[0]

        const response = await request(app)
          .get(`/api/games/${game.urlSlug}`)
          .send();

      expect(response.statusCode).toBe(200);

    });

    test("should specify application/json in the content type header", async () => {
      const response = await request(app).get("/api/games").send();

      expect(response.header["content-type"]).toEqual(
        expect.stringContaining("application/json")
      );
    });

    test("should return an object of game", async () => {
      const response = await request(app).get("/api/games").send();

      const postGame = response.body[0];

      expect(postGame).toHaveProperty("id");
      expect(postGame).toHaveProperty("title");
      expect(postGame).toHaveProperty("genre");
      expect(postGame).toHaveProperty("description");
      expect(postGame).toHaveProperty("releaseDate");
      expect(postGame).toHaveProperty("imageUrl");
      expect(postGame).toHaveProperty("urlSlug");
    });

  });
});

describe("POST /api/games", () => {

  describe("when creating a game", () => {

    test("should respond with a 201 status code", async () => {

      const game = {
        title: "TDD POST Tetris",
        genre: "Puzzle",
        description: "Lorem ipsum dolor",
        releaseDate: "1990-01-01",
        imageUrl: "https://via.placeholder.com/260x260.png?text=Game",
        urlSlug: "tetris-extreme",
      };

      const response = await request(app)
        .post(`/api/games`)
        .send(game);

      expect(response.statusCode).toBe(201);

      await request(app)
        .delete(`/api/games/${response.body.id}`);

    });

    test("should specify urlSlug in location header", async () => {

      const game = {
        title: "Tetris",
        genre: "Puzzle",
        description: "Lorem ipsum dolor",
        releaseDate: "1990-01-01",
        imageUrl: "https://via.placeholder.com/260x260.png?text=Game"
      };

      const response = await request(app)
        .post(`/api/games`)
        .send(game);

        expect(response.header['location']).toEqual(
          expect.stringContaining(`/api/games/${response.body.urlSlug}`)
        );

      await request(app)
        .delete(`/api/games/${response.body.id}`);

    })

    test("should return an object of game", async () => {
      const response = await request(app).get("/api/games").send();

      const postGame = response.body[0];

      expect(postGame).toHaveProperty("id");
      expect(postGame).toHaveProperty("title");
      expect(postGame).toHaveProperty("genre");
      expect(postGame).toHaveProperty("description");
      expect(postGame).toHaveProperty("releaseDate");
      expect(postGame).toHaveProperty("imageUrl");
      expect(postGame).toHaveProperty("urlSlug");
    });
  });
});

describe("DELETE /api/games", () => {
  describe("when deleting a game", () => {
    test("should respond with a 204 status code", async () => {
      const game = {
        title: "TDD Delete Tetris",
        genre: "Puzzle",
        description: "Lorem ipsum dolor",
        releaseDate: "1990-01-01",
        imageUrl: "https://via.placeholder.com/260x260.png?text=Game",
        urlSlug: "tetris-extreme",
      };

      const toBeDeletedGame = await request(app).post("/api/games").send(game);

      const response = await request(app).delete(
        `/api/games/${toBeDeletedGame.body.id}`
      );

      expect(response.statusCode).toBe(204);
    });
  });
});
