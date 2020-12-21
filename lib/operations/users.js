async function saveUser(type, profile) {
  const user = {
    id: `${type}-${profile.id}`,
    [type]: profile,
    profile: {
      name: profile.name,
      avatar: profile.avatar,
    },
  };
  const path = `data/users/${user.id}.json`;0
  await this.saveFile(path, JSON.stringify(user, null, 2));
  return user.id;
}

async function getUser(id) {
  const path = `data/users/${id}.json`;
  const jsonUser = await this.getFile(path);
  if (!jsonUser) {
    return null;
  }
  return JSON.parse(jsonUser);
}

module.exports = {
  saveUser,
  getUser,
};
