import { nanoid } from "nanoid";

async function getAllComments(slug, options = {}) {
  const path = `data/comments/${slug}.json`;
  const jsonString = await this.getFile(path, options.sha);
  if (!jsonString) {
    return [];
  }
  return JSON.parse(jsonString);
}

async function getComments(slug, options = {}) {
  return this.getAllComments(slug, options);
}

async function getCommentsWithPagination(slug, options = {}) {
  const { sha, sort = 1, limit = 5, offset = null } = options;
  const comments = await this.getAllComments(slug, { sha });
  // sort it
  comments.sort((a, b) => {
    return sort === 1 ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
  });
  // remove everything upto the offset
  let foundOffset = false;
  const commentsWithOffset = offset
    ? comments.filter((c) => {
        if (foundOffset) {
          return true;
        }
        foundOffset = c.createdAt == offset;
        return false;
      })
    : comments;
  // apply the limit
  const commentsWithLimit = commentsWithOffset.slice(0, limit);
  return commentsWithLimit;
}

async function addComment(slug, comment, options = {}) {
  const path = `data/comments/${slug}.json`;
  if (!comment.id) {
    comment.id = nanoid(30);
  }
  const comments = await this.getAllComments(slug, options);
  comments.push(comment);
  await this.saveFile(path, JSON.stringify(comments, null, 2), options.sha);
  return comment;
}

module.exports = {
  getAllComments,
  getComments,
  getCommentsWithPagination,
  addComment,
};
