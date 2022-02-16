const app = require("../app/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  db.end();
});

describe("/api", () => {
  test("404 - recieves back 'path not found'", () => {
    return request(app)
      .get("/invalid-path")
      .expect(404)
      .then(({ body: { errMsg } }) => {
        expect(errMsg).toBe("path not found");
      });
  });
  describe("GET", () => {
    test("Returns a 200 with no body", () => {
      return request(app).get("/api").expect(200);
    });
  });
  describe("/topics", () => {
    describe("GET", () => {
      test("200 - recieves back a list of topics with slug and description", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            topics.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
  describe("/articles", () => {
    describe("/:article_id", () => {
      describe("cannot get article errors", () => {
        test("400 - invalid article id", () => {
          return request(app)
            .get("/api/articles/invalid-id")
            .expect(400)
            .then(({ body: { errMsg } }) => {
              expect(errMsg).toBe("invalid article id");
            });
        });
        test("404 - article not found", () => {
          return request(app)
            .get("/api/articles/7400")
            .expect(404)
            .then(({ body: { errMsg } }) => {
              expect(errMsg).toBe("article not found");
            });
        });
        test("400 - invalid article id", () => {
          return request(app)
            .patch("/api/articles/invalid-id")
            .send({ inc_votes: 10 })
            .expect(400)
            .then(({ body: { errMsg } }) => {
              expect(errMsg).toBe("invalid article id");
            });
        });
        test("404 - article not found", () => {
          return request(app)
            .patch("/api/articles/7400")
            .send({ inc_votes: 10 })
            .expect(404)
            .then(({ body: { errMsg } }) => {
              expect(errMsg).toBe("article not found");
            });
        });
      });
      describe("GET", () => {
        test("200 - recieves back an article with required properties", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).toEqual(
                expect.objectContaining({
                  author: "butter_bridge",
                  title: "Living in the shadow of a great man",
                  article_id: 1,
                  body: "I find this existence challenging",
                  topic: "mitch",
                  created_at: expect.stringMatching(
                    /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)/
                  ),
                  votes: expect.any(Number),
                })
              );
            });
        });
      });
      describe("PATCH", () => {
        test("200 - recieves back the article with the correct values after being altered", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  topic: "mitch",
                  author: "butter_bridge",
                  body: "I find this existence challenging",
                  votes: 110,
                  created_at: expect.stringMatching(
                    /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)/
                  ),
                })
              );
            });
        });
        test("400 - error given for no inc_votes property", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(400)
            .then(({ body: { errMsg } }) => {
              expect(errMsg).toBe("no inc_votes present");
            });
        });
      });
    });
  });
});