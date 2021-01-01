import { parseSlug } from "../../utils/helpers";

async function getPostList(options = {}) {
  if (options.ownerId) {
    const jsonPostList = await this.getJsonPostList(options);
    const ownerPosts = jsonPostList.filter(
      (p) => p.ownerId === options.ownerId
    );
    return ownerPosts.sort((a, b) => (b.createdAt = a.createdAt));
  }

  const [jsonPostList, markdownPostList] = await Promise.all([
    this.getJsonPostList(options),
    this.getMarkdownPostList(options),
  ]);

  const allPosts = [...jsonPostList, ...markdownPostList];
  return allPosts.sort((a, b) => b.createdAt - a.createdAt);
}

async function getJsonPostList(options = {}) {
  const payload = {
    owner: this.rootOptions.owner,
    repo: this.rootOptions.repo,
    path: "data/posts",
    ref: options.sha,
  };
  if (!payload.ref) {
    delete payload.ref;
  }
  try {
    const response = await this.octokit.repos.getContent(payload);
    if (!Array.isArray(response.data)) {
      throw new Error(`data/posts directory does not exists`);
    }
    const posts = await Promise.all(
      response.data.map(async (file) => {
        const slug = file.name.replace(/.json$/, "");
        const jsonPost = await this.getFile(`data/posts/${file.name}`);
        const post = JSON.parse(jsonPost);
        delete post.content;
        post.slug = slug;
        return post;
      })
    );
    return posts;
  } catch (err) {
    if (err.status === 404) {
      return [];
    }
  }
}

async function getMarkdownPostList(options = {}) {
  const payload = {
    owner: this.rootOptions.owner,
    repo: this.rootOptions.repo,
    path: "data",
    ref: options.sha,
  };
  if (!payload.ref) {
    delete payload.ref;
  }
  const response = await this.octokit.repos.getContent(payload);
  if (!Array.isArray(response.data)) {
    throw new Error(`data directory does not exists`);
  }
  return response.data
    .filter((file) => /.md$/.test(file.name))
    .map((file) => {
      const slug = file.name.replace(/.md$/, "");
      return Object.assign({ slug }, parseSlug(slug));
    });
}

async function getPost(slug, options = {}) {
  const path = `data/${slug}.md`;
  const content = await this.getFile(path);
  if (!content) {
    // try to get from the post directory
    const jsonPost = await this.getFile(`data/posts/${slug}.json`, options.sha);
    if (!jsonPost) {
      return null;
    }
    return JSON.parse(jsonPost);
  }
  return Object.assign(Object.assign({ slug }, parseSlug(slug)), { content });
}

async function createPost(slug, { ownerId, title, content }) {
  const createdAt = Date.now();
  const post = {
    ownerId,
    slug,
    title,
    content,
    createdAt,
    updatedAt: createdAt,
  };
  const path = `data/posts/${slug}.json`;
  await this.saveFile(path, JSON.stringify(post, null, 2));
  return post;
}

async function updatePost(slug, { ownerId, title, content }) {
  const post = await this.getPost(slug);
  if (!post) {
    throw new Error(`Post not found`);
  }
  if (post.ownerId !== ownerId) {
    throw new Error(`Invalid ownerId`);
  }
  post.title = title;
  post.content = content;
  post.updatedAt = Date.now();
  const path = `data/posts/${slug}.json`;
  await this.saveFile(path, JSON.stringify(post, null, 2));
  return post;
}

async function deletePost(slug, { ownerId }) {
  const post = await this.getPost(slug);
  if (!post) {
    throw new Error(`Post not found`);
  }
  if (post.ownerId !== ownerId) {
    throw new Error(`Invalid ownerId`);
  }
  const path = `data/posts/${slug}.json`;
  await this.deleteFile(path);
}

module.exports = {
  getPostList,
  getJsonPostList,
  getMarkdownPostList,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
