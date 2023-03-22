export function removeNullAndUndefined(obj) {
  const newObj = {};
  for (const key in obj) {
    if (
      Object.hasOwn(obj, key) &&
      obj[key] !== null &&
      obj[key] !== undefined
    ) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

export function getRelevantGithubUserFieldsForComposeDB(githubUserData) {
  const relevantFields = {
    login: githubUserData.login,
    github_id: githubUserData.id,
    url: githubUserData.url,
    html_url: githubUserData.html_url,
    type: githubUserData.type,
    site_admin: githubUserData.site_admin,
    name: githubUserData.name,
    company: githubUserData.company,
    blog: githubUserData.blog,
    location: githubUserData.location,
    email: githubUserData.email,
    hireable: githubUserData.hireable,
    bio: githubUserData.bio,
    twitter_username: githubUserData.twitter_username,
    public_repos: githubUserData.public_repos,
    public_gists: githubUserData.public_gists,
    followers: githubUserData.followers,
    following: githubUserData.following,
    created_at: githubUserData.created_at,
  };

  return relevantFields;
}

export function achievementsAsArray(achievements) {
  const achievementsArray = [];
  for (const achievement in achievements) {
    if (Object.hasOwn(achievements, achievement)) {
      achievementsArray.push({
        name: achievement,
        x_val: achievements[achievement],
      });
    }
  }
  return achievementsArray;
}
