import { Octokit } from "@octokit/rest";
import * as matter from "gray-matter";
import Posts from "./git-ops/posts";
import Comments from "./git-ops/comments";
import Files from "./git-ops/files";
import Users from "./git-ops/users";
import { parseSlug, getCurrentSections } from "@/utils/helpers";

export class GitHubCMS {
  constructor(o) {
    this.rootOptions = o;
    this.octokit = new Octokit({
      auth: this.rootOptions.token,
    });

    this.getPostList = Posts.getPostList;
    this.getJsonPostList = Posts.getJsonPostList;
    this.getMarkdownPostList = Posts.getMarkdownPostList;
    this.getPost = Posts.getPost;
    this.createPost = Posts.createPost;
    this.updatePost = Posts.updatePost;
    this.deletePost = Posts.deletePost;

    this.getAllComments = Comments.getAllComments;
    this.getComments = Comments.getComments;
    this.getCommentsWithPagination = Comments.getCommentsWithPagination;
    this.addComment = Comments.addComment;

    this.getFile = Files.getFile;
    this.deleteFile = Files.deleteFile;
    this.saveFile = Files.saveFile;

    this.saveUser = Users.saveUser;
    this.getUser = Users.getUser;
  }

  async getPageList(options = {}) {
    // if (options.ownerId) {
    //   const jsonPageList = await this.getJsonPageList(options);
    //   const ownerPages = jsonPageList.filter(
    //     (p) => p.ownerId === options.ownerId
    //   );
    //   return ownerPages.sort((a, b) => (b.createdAt = a.createdAt));
    // }

    // const [jsonPageList, markdownPageList] = await Promise.all([
    //   this.getJsonPageList(options),
    //   this.getMarkdownPageList(options),
    // ]);
    const [_, markdownPageList] = await Promise.all([
      this.getJsonPageList(options),
      this.getMarkdownPageList(options),
    ]);

    const allPages = [...markdownPageList];
    return allPages.sort((a, b) => b.createdAt - a.createdAt);
  }

  async getJsonPageList(options = {}) {
    const payload = {
      owner: this.rootOptions.owner,
      repo: this.rootOptions.repo,
      path: "data/sections",
      ref: options.sha,
    };
    if (!payload.ref) {
      delete payload.ref;
    }
    try {
      const response = await this.octokit.repos.getContent(payload);
      if (!Array.isArray(response.data)) {
        throw new Error(`data/pages directory does not exists`);
      }
      const pages = await Promise.all(
        response.data.map(async (file) => {
          const slug = file.name.replace(/.json$/, "");
          const jsonPage = await this.getFile(`data/pages/${file.name}`);
          const page = JSON.parse(jsonPage);
          delete page.content;
          page.slug = slug;
          return page;
        })
      );
      return pages;
    } catch (err) {
      if (err.status === 404) {
        return [];
      }
    }
  }

  async getMarkdownPageList(options = {}) {
    const payload = {
      owner: this.rootOptions.owner,
      repo: this.rootOptions.repo,
      path: "data/sections",
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

  async getSections(path, slug) {
    const content = await this.getFile(path);
    return Object.assign(Object.assign({ slug }, parseSlug(slug)), { content });
  }

  async getAllSections(page, options = {}) {
    // const path = `data/${slug}.md`;

    // const content = await this.getFile(path);
    // if (!content) {
    //   // try to get from the page directory
    //   const jsonPage = await this.getFile(
    //     `data/pages/${slug}.json`,
    //     options.sha
    //   );
    //   if (!jsonPage) {
    //     return null;
    //   }
    //   return JSON.parse(jsonPage);
    // }
    // return Object.assign(Object.assign({ slug }, parseSlug(slug)), { content });

    const payload = {
      owner: this.rootOptions.owner,
      repo: this.rootOptions.repo,
      path: `data/sections`,
      ref: options.sha,
    };

    if (!payload.ref) {
      delete payload.ref;
    }

    const response = await this.octokit.repos.getContent(payload);
    if (!Array.isArray(response.data)) {
      throw new Error(`data directory does not exists`);
    }

    const pageList = response.data
      .filter((file) => /.md$/.test(file.name))
      .map((file) => {
        const slug = file.name.replace(/.md$/, "");
        return Object.assign({ slug }, parseSlug(slug));
      });

    const allSections = await Promise.all(
      response.data.map(async (file, i) => {
        const section = await this.getSections(file.path, pageList[i].slug);
        // return section
        const parsedSection = matter(section)
        delete parsedSection.orig // remove the data buffer from object
        return parsedSection;
      })
    );

    // utility fn that returns only sections related to page
    const sections = getCurrentSections(page, allSections);
    return sections
  }
}
