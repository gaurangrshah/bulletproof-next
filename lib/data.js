import githubCms from './github-cms'
import * as fsCms from './fs-cms'

function canUseGitHub() {
    return Boolean(process.env.GITHUB_PAT)
}

export async function getPageList({ownerId} = {}) {
    if (canUseGitHub()) {
        return githubCms.getPageList({ownerId})
    }

    // return fsCms.getPageList({ownerId})
}

export async function getPostList({ownerId} = {}) {
    if (canUseGitHub()) {
        return githubCms.getPostList({ownerId})
    }

    return fsCms.getPostList({ownerId})
}

export async function getPost(slug, {ownerId} = {}) {
    if (canUseGitHub()) {
        return githubCms.getPost(slug, {ownerId})
    }

    return fsCms.getPost(slug)
}

export async function getPage(slug, {ownerId} = {}) {
    if (canUseGitHub()) {
        return githubCms.getPage(slug, {ownerId})
    }
    // return fsCms.getPage(slug)
}

export async function getAllSections(page, { ownerId } = {}) {
  if (canUseGitHub()) {
    return githubCms.getAllSections(page, { ownerId });
  }
  // return fsCms.getPageSections(page)
}

export async function deletePost(slug, {ownerId} = {}) {
    if (canUseGitHub()) {
        return githubCms.deletePost(slug, {ownerId})
    }

    return fsCms.deletePost(slug, {ownerId})
}

export async function createPost({ownerId, slug, title, content}) {
    if (canUseGitHub()) {
        return githubCms.createPost(slug, {ownerId, title, content})
    }

    return fsCms.createPost({ownerId, slug, title, content})
}

export async function updatePost({ownerId, slug, title, content}) {
    if (canUseGitHub()) {
        return githubCms.updatePost(slug, {ownerId, title, content})
    }

    return fsCms.updatePost({ownerId, slug, title, content})
}

export async function saveUser(type, profile) {
    if (canUseGitHub()) {
        return githubCms.saveUser(type, profile)
    }

    return fsCms.saveUser(type, profile)
}

export async function getUser(id) {
    if (canUseGitHub()) {
        return githubCms.getUser(id)
    }

    return fsCms.getUser(id)
}

export async function getComments(slug, options) {
    if (canUseGitHub()) {
        return githubCms.getCommentsWithPagination(slug, options)
    }

    return fsCms.getComments(slug, options)
}

export async function addComment(slug, comment) {
    if (canUseGitHub()) {
        return githubCms.addComment(slug, comment)
    }

    return fsCms.addComment(slug, comment)
}
