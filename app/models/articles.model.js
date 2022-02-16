const db = require("../../db/connection");
exports.selectArticleById = async (id) => {
  const { rows: articles } = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [id]
  );
  const [article] = articles;
  return article;
};

exports.checkArticleById = async (id) => {
  const { rows: articles } = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [id]
  );
  const [article] = articles;
  if (!article)
    return Promise.reject({ status: 404, errMsg: "article not found" });
};

exports.updateArticleVotes = async (id, votes) => {
  const { rows: articles } = await db.query(
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
    [votes, id]
  );
  const [article] = articles;
  return article;
};
