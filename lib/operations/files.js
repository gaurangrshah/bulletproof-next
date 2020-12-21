async function getFile(path, sha) {
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

async function deleteFile(path, sha) {
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

async function saveFile(path, content, sha) {
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

module.exports = {
  getFile,
  deleteFile,
  saveFile,
};
