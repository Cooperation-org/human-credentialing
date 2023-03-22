// This is an auto-generated file, do not edit manually
export const definition = {
  models: {
    GithubUser: {
      id: "kjzl6hvfrbw6c6iga46b1xj80g1a7m9p7y51qlw4yqyvtudk1yzbfprprcvfuhk",
      accountRelation: { type: "list" },
    },
    FiverrProfile: {
      id: "kjzl6hvfrbw6c9vg1q5mo65vojdd131ezuakjrunhgca5qk0ty62s9ui3hqjz2z",
      accountRelation: { type: "list" },
    },
    PlatformRating: {
      id: "kjzl6hvfrbw6cb02b8ypubp8ckvov8e9cn5hw80c8tdbxtbt9a0z59ky0eqb335",
      accountRelation: { type: "list" },
    },
  },
  objects: {
    GithubUserGithubAchievement: {
      name: { type: "string", required: true },
      x_val: { type: "integer", required: true },
    },
    GithubUser: {
      bio: { type: "string", required: false },
      url: { type: "string", required: true },
      blog: { type: "string", required: false },
      name: { type: "string", required: false },
      type: { type: "string", required: true },
      email: { type: "string", required: false },
      login: { type: "string", required: true },
      company: { type: "string", required: false },
      hireable: { type: "boolean", required: false },
      location: { type: "string", required: false },
      followers: { type: "integer", required: false },
      following: { type: "integer", required: false },
      github_id: { type: "integer", required: true },
      created_at: { type: "string", required: true },
      site_admin: { type: "boolean", required: false },
      achievements: {
        type: "list",
        required: false,
        item: {
          type: "reference",
          refType: "object",
          refName: "GithubUserGithubAchievement",
          required: false,
        },
      },
      public_gists: { type: "integer", required: false },
      public_repos: { type: "integer", required: false },
      user_account: { type: "string", required: true },
      twitter_username: { type: "string", required: false },
    },
    FiverrProfileEducation: {
      degree: { type: "string", required: false },
      institution: { type: "string", required: false },
    },
    FiverrProfileLanguageProficiency: {
      lang: { type: "string", required: false },
      proficiency: { type: "string", required: false },
    },
    FiverrProfileSkillTests: {
      skill: { type: "string", required: false },
      status: { type: "string", required: false },
      scorePercentage: { type: "float", required: false },
    },
    FiverrProfileStarCounters: {
      type: { type: "string", required: false },
      count: { type: "integer", required: false },
    },
    FiverrProfileRatingBreakdown: {
      type: { type: "string", required: false },
      rating: { type: "float", required: false },
    },
    FiverrProfile: {
      name: { type: "string", required: true },
      skills: {
        type: "list",
        required: false,
        item: { type: "string", required: false },
      },
      location: { type: "string", required: false },
      education: {
        type: "list",
        required: false,
        item: {
          type: "reference",
          refType: "object",
          refName: "FiverrProfileEducation",
          required: false,
        },
      },
      languages: {
        type: "list",
        required: false,
        item: {
          type: "reference",
          refType: "object",
          refName: "FiverrProfileLanguageProficiency",
          required: false,
        },
      },
      skillTests: {
        type: "list",
        required: false,
        item: {
          type: "reference",
          refType: "object",
          refName: "FiverrProfileSkillTests",
          required: false,
        },
      },
      description: { type: "string", required: false },
      numOfReviews: { type: "integer", required: false },
      starCounters: {
        type: "list",
        required: false,
        item: {
          type: "reference",
          refType: "object",
          refName: "FiverrProfileStarCounters",
          required: false,
        },
      },
      user_account: { type: "string", required: true },
      overallRating: { type: "float", required: false },
      notableClients: {
        type: "list",
        required: false,
        item: { type: "string", required: false },
      },
      ratingBreakdown: {
        type: "list",
        required: false,
        item: {
          type: "reference",
          refType: "object",
          refName: "FiverrProfileRatingBreakdown",
          required: false,
        },
      },
    },
    PlatformRating: {
      rating: { type: "float", required: false },
      user_id: { type: "string", required: false },
      user_name: { type: "string", required: false },
      platform_name: { type: "string", required: true },
    },
  },
  enums: {},
  accountData: {
    githubUserList: { type: "connection", name: "GithubUser" },
    fiverrProfileList: { type: "connection", name: "FiverrProfile" },
    platformRatingList: { type: "connection", name: "PlatformRating" },
  },
};
