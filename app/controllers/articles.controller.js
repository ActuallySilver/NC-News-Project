const models = require("../models");
const { selectArticleById } = require("../models/articles.model");
exports.getArticleById = async (req, res, next) => {
  const { article_id: articleId } = req.params;
  try {
    const article = await models.articles.selectArticleById(articleId);
    res.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};

exports.changeArticleVotes = async (req, res, next) => {
  if (!req.body.inc_votes)
    return next({ status: 400, errMsg: "no inc_votes present" });
  const { article_id: articleId } = req.params;
  const { inc_votes } = req.body;

  const article = await models.articles.updateArticleVotes(
    articleId,
    inc_votes
  );

  res.status(200).send({ article });
};

exports.checkArticleExists = async (req, res, next) => {
  const { article_id: articleId } = req.params;
  try {
    const article = await models.articles.checkArticleById(articleId);
    next();
  } catch (error) {
    next(error);
  }
};
