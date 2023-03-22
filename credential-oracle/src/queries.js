export const CREATE_GITHUB_USER = `
  mutation (
      $user_account: String!
      $login: String!
      $github_id: Int!
      $url: String!
      $type: String!
      $site_admin: Boolean
      $name: String
      $company: String
      $blog: String
      $location: String
      $email: String
      $hireable: Boolean
      $bio: String
      $twitter_username: String
      $public_repos: Int
      $public_gists: Int
      $followers: Int
      $following: Int
      $created_at: String!
      $achievements: [GithubUserGithubAchievementInput]
  ) {
  createGithubUser(
      input: {
          content: {
              user_account: $user_account
              login: $login
              github_id: $github_id
              company: $company
              url: $url
              type: $type
              site_admin: $site_admin
              name: $name
              blog: $blog
              location: $location
              email: $email
              hireable: $hireable
              bio: $bio
              twitter_username: $twitter_username
              public_repos: $public_repos
              public_gists: $public_gists
              followers: $followers
              following: $following
              created_at: $created_at
              achievements: $achievements
          }
      }
      ){
          document {
              id
              user_account
              login
              github_id
              company
              url
              type
              site_admin
              name
              blog
              location
              email
              hireable
              bio
              twitter_username
              public_repos
              public_gists
              followers
              following
              created_at
              achievements {
                  name
                  x_val                    
              }
          }
      }
  }
`;

export const CREATE_FIVERR_PROFILE = `
  mutation (
    $user_account: String!
    $name: String!
    $location: String
    $education: [FiverrProfileEducationInput]
    $description: String
    $overallRating: Float
    $languages: [FiverrProfileLanguageProficiencyInput]
    $skills: [String]
    $notableClients: [String]
    $numOfReviews: Int
    $ratingBreakdown: [FiverrProfileRatingBreakdownInput]
    $starCounters: [FiverrProfileStarCountersInput]
    $skillTests: [FiverrProfileSkillTestsInput]
  ) {
    createFiverrProfile(
      input: {
        content: {
          user_account: $user_account
          name: $name
          location: $location
          education: $education
          description: $description
          overallRating: $overallRating
          languages: $languages
          skills: $skills
          notableClients: $notableClients
          numOfReviews: $numOfReviews
          ratingBreakdown: $ratingBreakdown
          starCounters: $starCounters
          skillTests: $skillTests
        }
      }
    ){
      document {
        id
        user_account
        name
        location
        education {
          degree
          institution
        }
        description
        overallRating
        languages {
          lang
          proficiency
        }
        skills
        notableClients
        numOfReviews
        ratingBreakdown {
          type
          rating
        }
        starCounters {
          type
          count
        }
        skillTests {
          skill
          scorePercentage
          status
        }
      }
    }
  }
`;

export const UPDATE_FIVERR_PROFILE = `
  mutation (
    $id: ID!
    $user_account: String
    $name: String
    $location: String
    $education: [FiverrProfileEducationInput]
    $description: String
    $overallRating: Float
    $languages: [FiverrProfileLanguageProficiencyInput]
    $skills: [String]
    $notableClients: [String]
    $numOfReviews: Int
    $ratingBreakdown: [FiverrProfileRatingBreakdownInput]
    $starCounters: [FiverrProfileStarCountersInput]
    $skillTests: [FiverrProfileSkillTestsInput]
  ) {
    updateFiverrProfile(
      input: {
        id: $id
        content: {
          user_account: $user_account
          name: $name
          location: $location
          education: $education
          description: $description
          overallRating: $overallRating
          languages: $languages
          skills: $skills
          notableClients: $notableClients
          numOfReviews: $numOfReviews
          ratingBreakdown: $ratingBreakdown
          starCounters: $starCounters
          skillTests: $skillTests
        }
      }
    ){
      document {
        id
        user_account
        name
        location
        education {
          degree
          institution
        }
        description
        overallRating
        languages {
          lang
          proficiency
        }
        skills
        notableClients
        numOfReviews
        ratingBreakdown {
          type
          rating
        }
        starCounters {
          type
          count
        }
        skillTests {
          skill
          scorePercentage
          status
        }
      }
    }
  }
`;

export const SAVE_HASHED_API_KEY = `
  mutation (
    $platform: String! 
    $hashed_api_key: String! 
  ) {
    createPlatformApiKey(
      input: {
        content: {
          platform: $platform
          hashed_api_key: $hashed_api_key
        }
      }
    ){
      document {
        id
      }
    }
  }
`;

export const UPDATE_HASHED_API_KEY = `
  mutation (
    $id: ID!
    $hashed_api_key: String! 
  ) {
    updatePlatformApiKey(
      input: {
        id: $id
        content: {
          hashed_api_key: $hashed_api_key
        }
      }
    ){
      document {
        id
      }
    }
  }
`;

export const CREATE_PLATFORM_RATING = `
  mutation (
    $platform_name: String! 
    $user_name: String
    $user_id: String
    $rating: Float
  ) {
    createPlatformRating(
      input: {
        content: {
          platform_name: $platform_name 
          user_name: $user_name
          user_id: $user_id
          rating: $rating
        }
      }
    ){
      document {
        id
        platform_name
        user_name
        user_id
        rating
      }
    }
  }
`;

export const UPDATE_PLATFORM_RATING = `
  mutation (
    $id: ID!
    $user_name: String
    $rating: Float
  ) {
    updatePlatformRating(
      input: {
        id: $id
        content: {
          user_name: $user_name
          rating: $rating
        }
      }
    ){
      document {
        id
        platform_name
        user_name
        user_id
        rating
      }
    }
  }
`;
