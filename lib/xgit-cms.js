import { Octokit } from "@octokit/rest";
import { nanoid } from "nanoid";

export class GitHubCMS {
  constructor(o) {
    this.rootOptions = o;
    this.octokit = new Octokit({
      auth: this.rootOptions.token,
    });
  }

  async getPostList(options = {}) {
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

  async getJsonPostList(options = {}) {
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

  async getMarkdownPostList(options = {}) {
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

  async getPost(slug, options = {}) {
    const path = `data/${slug}.md`;
    const content = await this.getFile(path);
    if (!content) {
      // try to get from the post directory
      const jsonPost = await this.getFile(
        `data/posts/${slug}.json`,
        options.sha
      );
      if (!jsonPost) {
        return null;
      }
      return JSON.parse(jsonPost);
    }
    return Object.assign(Object.assign({ slug }, parseSlug(slug)), { content });
  }

  async getAllComments(slug, options = {}) {
    const path = `data/comments/${slug}.json`;
    const jsonString = await this.getFile(path, options.sha);
    if (!jsonString) {
      return [];
    }
    return JSON.parse(jsonString);
  }

  async getComments(slug, options = {}) {
    return this.getAllComments(slug, options);
  }
  async getCommentsWithPagination(slug, options = {}) {
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

  async addComment(slug, comment, options = {}) {
    const path = `data/comments/${slug}.json`;
    if (!comment.id) {
      comment.id = nanoid(30);
    }
    const comments = await this.getAllComments(slug, options);
    comments.push(comment);
    await this.saveFile(path, JSON.stringify(comments, null, 2), options.sha);
    return comment;
  }

  async saveUser(type, profile) {
    const user = {
      id: `${type}-${profile.id}`,
      [type]: profile,
      profile: {
        name: profile.name,
        avatar: profile.avatar,
      },
    };
    const path = `data/users/${user.id}.json`;
    await this.saveFile(path, JSON.stringify(user, null, 2));
    return user.id;
  }
  async getUser(id) {
    const path = `data/users/${id}.json`;
    const jsonUser = await this.getFile(path);
    if (!jsonUser) {
      return null;
    }
    return JSON.parse(jsonUser);
  }

  async createPost(slug, { ownerId, title, content }) {
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
  async updatePost(slug, { ownerId, title, content }) {
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

  async deletePost(slug, { ownerId }) {
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
  async getFile(path, sha) {
    const baseInfo = {
      owner: this.rootOptions.owner,
      repo: this.rootOptions.repo,
      path,
      ref: sha,
    };
    if (!sha) {
      delete baseInfo.ref;
    }
    try {
      const response = await this.octokit.repos.getContent(baseInfo);
      if (Array.isArray(response.data)) {
        throw new Error(`Provided path("${path}") is a directory`);
      }
      return Buffer.from(response.data.content, "base64").toString("utf8");
    } catch (err) {
      if (err.status === 404) {
        return null;
      }
      throw err;
    }
  }

  async deleteFile(path, sha) {
    const baseInfo = {
      owner: this.rootOptions.owner,
      repo: this.rootOptions.repo,
      path,
      ref: sha,
    };
    if (!sha) {
      delete baseInfo.ref;
    }
    try {
      const response = await this.octokit.repos.getContent(baseInfo);
      await this.octokit.repos.deleteFile(
        Object.assign(Object.assign({}, baseInfo), {
          sha: response.data.sha,
          message: `Updated content at ${path}`,
        })
      );
    } catch (err) {
      if (err.status === 404) {
        return null;
      }
      throw err;
    }
  }

  async saveFile(path, content, sha) {
    const baseInfo = {
      owner: this.rootOptions.owner,
      repo: this.rootOptions.repo,
      path,
      ref: sha,
    };
    if (!sha) {
      delete baseInfo.ref;
    }
    try {
      const response = await this.octokit.repos.getContent(baseInfo);
      await this.octokit.repos.createOrUpdateFileContents(
        Object.assign(Object.assign({}, baseInfo), {
          sha: response.data.sha,
          content: Buffer.from(content).toString("base64"),
          message: `Updated content at ${path}`,
        })
      );
    } catch (err) {
      if (err.status === 404) {
        await this.octokit.repos.createOrUpdateFileContents(
          Object.assign(Object.assign({}, baseInfo), {
            content: Buffer.from(content).toString("base64"),
            message: `Added content to ${path}`,
          })
        );
        return;
      }
      throw err;
    }
  }
}

export function parseSlug(slug) {
  const [year, month, day, ...titleParts] = slug.split("-");
  const title = titleParts
    .map((w) => {
      if (w.length < 4) {
        return w;
      }
      return `${w[0].toUpperCase()}${w.substr(1)}`;
    })
    .join(" ");
  const createdAt = new Date(`${year}-${month}-${day}`).getTime();
  return {
    title,
    createdAt,
  };
}
