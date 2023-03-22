import crypto from "crypto";
import cors from "cors";
import axios from "axios";
import express from "express";
import NodeCache from "node-cache";
import { getGithubUserAchievements } from "@whatscookin/github_user_badge_scraper";
import { compose } from "./compose.js";
import {
  removeNullAndUndefined,
  getRelevantGithubUserFieldsForComposeDB,
  achievementsAsArray,
} from "./utils.js";
import {
  CREATE_GITHUB_USER,
  CREATE_FIVERR_PROFILE,
  UPDATE_FIVERR_PROFILE,
  SAVE_HASHED_API_KEY,
  UPDATE_HASHED_API_KEY,
  CREATE_PLATFORM_RATING,
  UPDATE_PLATFORM_RATING,
} from "./queries.js";
import { scrapeFiverrProfile } from "./fiverr_scraper.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cache = new NodeCache();
const app = express();
const port = process.env.PORT || 3007;
const CERAMIC_QUERY_URL = process.env.CERAMIC_QUERY_URL;

app.use(express.json());
app.use(cors());

app.get("/get-github-profile/:userAccount", async function (req, res) {
  //  TECHDEBT
  //  This API will be removed once composedb implements the feature to query with fields
  //  https://forum.ceramic.network/t/queries-by-fields/260/6
  const { userAccount } = req.params;
  const queryUrl = `${CERAMIC_QUERY_URL}/get-github-profile/${userAccount}`;

  try {
    const result = await axios.get(queryUrl);
    res.status(200).json({ message: result.data });
  } catch (err) {
    let statusCode = err.response?.status || 500;
    let message = err.response?.data?.message || err.message;
    return res.status(statusCode).json({ message });
  }
});

app.post("/auth/github", async function (req, res) {
  const { githubAuthCode, userAccount } = req.body;

  if (!githubAuthCode || !userAccount) {
    return res.status(400).json({
      message: "githubAuthCode and userAccount are required fields",
    });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const accessTokenUrl = process.env.GITHUB_ACCESS_TOKEN_URL;

  try {
    const { data } = await axios.post(
      accessTokenUrl,
      {},
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          code: githubAuthCode,
        },
        headers: { Accept: "application/json" },
      }
    );
    if (data.error) {
      return res.status(400).json({ message: data.error });
    }

    const { access_token } = data;

    const { data: githubUserData } = await axios.get(
      "https://api.github.com/user",
      {
        headers: { Authorization: `token ${access_token}` },
      }
    );

    const relevantUserData =
      getRelevantGithubUserFieldsForComposeDB(githubUserData);

    const { html_url } = relevantUserData;
    const achievements = await getGithubUserAchievements(html_url);
    const achievementsArray = achievementsAsArray(achievements);

    let variables = {
      ...relevantUserData,
      achievements: achievementsArray,
      user_account: userAccount,
    };
    variables = removeNullAndUndefined(variables);

    const composeDBResult = await compose.executeQuery(
      CREATE_GITHUB_USER,
      variables
    );

    if (composeDBResult.errors) {
      return res
        .status(500)
        .json({ message: composeDBResult.errors[0].message });
    }

    res
      .status(201)
      .json({ message: composeDBResult.data.createGithubUser.document });
  } catch (err) {
    let statusCode = err.response?.status || 500;
    let message = err.response?.data?.message || err.message;

    res.status(statusCode).json({ message });
  }
});

app.get("/get-fiverr-magic-link", async (req, res, next) => {
  const { userAccount } = req.query;
  const magicToken = crypto.randomBytes(16).toString("hex");
  cache.set(userAccount, magicToken, 900); // expires in 15 minutes

  res.status(201).json({ magicToken });
});

app.get("/fiverr-profile/:userAccount", async (req, res) => {
  const { userAccount } = req.params;
  const queryUrl = `${CERAMIC_QUERY_URL}/fiverr-profile/${userAccount}`;

  try {
    const result = await axios.get(queryUrl);
    res.status(200).json({ message: result.data });
  } catch (err) {
    let statusCode = err.response?.status || 500;
    let message = err.response?.data?.message || err.message;
    return res.status(statusCode).json({ message });
  }
});

app.post("/fiverr-profile", async (req, res) => {
  const { url, userAccount } = req.body;
  const magicLink = cache.get(userAccount);

  if (!magicLink) {
    return res
      .status(401)
      .json({ message: "Please try to take a new token and try again" });
  }

  let existingProfile;
  const queryUrl = `${CERAMIC_QUERY_URL}/fiverr-profile/${userAccount}`;
  try {
    const response = await axios.get(queryUrl);
    existingProfile = response.data;
  } catch (err) {
    let statusCode = err.response?.status || 500;
    if (statusCode !== 404) {
      let message = err.response?.data?.message || err.message;
      return res.status(statusCode).json({ message });
    }
  }

  let profile;
  try {
    profile = await scrapeFiverrProfile(url);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: "Something went wrong!" });
  }

  const indexOfMagicLink = profile.description?.indexOf(magicLink);

  if (indexOfMagicLink === -1) {
    return res.status(403).json({ message: "Token not found in description." });
  }
  if (indexOfMagicLink === undefined) {
    return res.status(500).json({ message: "Something went wrong!" });
  }

  profile = removeNullAndUndefined(profile);

  let query = CREATE_FIVERR_PROFILE;
  let variables = { user_account: userAccount, ...profile };

  if (existingProfile) {
    query = UPDATE_FIVERR_PROFILE;
    variables = { id: existingProfile.id, ...variables };
  }

  const composeDBResult = await compose.executeQuery(query, variables);

  if (composeDBResult.errors) {
    return res.status(500).json({ message: composeDBResult.errors[0].message });
  }

  res.status(200).json({ message: composeDBResult });
});

// to do - we need to think about how this will be authenticated
app.get("/api-key", async (req, res) => {
  const { platform } = req.query;

  if (!platform) {
    return res.status(400).json({ message: "platform is required" });
  }

  const apiKey = crypto.randomBytes(32).toString("hex");
  const hashedApiKey = crypto.createHash("sha256").update(apiKey).digest("hex");

  await prisma.platformApiKey.upsert({
    create: {
      platform,
      hashedApiKey,
    },
    update: {
      hashedApiKey,
    },
    where: {
      platform,
    },
  });

  res.status(201).json({ apiKey });
});

app.post("/platform-rating", async (req, res) => {
  let apiKey = req.header("x-api-key");

  const { userName, userId, rating } = req.body;

  const hashedApiKey = crypto.createHash("sha256").update(apiKey).digest("hex");
  const apiKeyInDB = await prisma.platformApiKey.findFirst({
    where: {
      hashedApiKey,
    },
  });

  if (!apiKeyInDB || apiKeyInDB?.hashedApiKey !== hashedApiKey) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { platform } = apiKeyInDB;

  let existingRating;
  const platformRatingURL = `${CERAMIC_QUERY_URL}/platform-rating/${platform}/${userId}`;
  try {
    const response = await axios.get(platformRatingURL);
    existingRating = response.data;
  } catch (err) {
    let statusCode = err.response?.status || 500;
    if (statusCode !== 404) {
      let message = err.response?.data?.message || err.message;
      return res.status(statusCode).json({ message });
    }
  }

  const query = existingRating
    ? UPDATE_PLATFORM_RATING
    : CREATE_PLATFORM_RATING;

  let variables = existingRating
    ? { id: existingRating.id, user_name: userName, rating }
    : {
        platform_name: platform,
        user_name: userName,
        user_id: userId,
        rating,
      };

  const composeDBResult = await compose.executeQuery(query, variables);

  if (composeDBResult.errors) {
    return res.status(500).json({ message: composeDBResult.errors[0].message });
  }

  const doc = existingRating
    ? composeDBResult.data.updatePlatformRating.document
    : composeDBResult.data.createPlatformRating.document;

  res.status(201).json({ message: doc });
});


app.get("/workers/:userAccount", async (req, res) => {
  const { userAccount } = req.params;
  const gitqueryUrl = `${CERAMIC_QUERY_URL}/get-github-profile/${userAccount}`;
  const fivqueryUrl = `${CERAMIC_QUERY_URL}/fiverr-profile/${userAccount}`;
  let gitresult = {}
  let fivresult = {}

  try {
    gitresult = await axios.get(gitqueryUrl);
  } catch (err) {
  }
  try {
    fivresult = await axios.get(fivqueryUrl);
  } catch (err) {
  }
  res.status(200).json({ message: Object.assign({}, {"git" :gitresult.data}, {"fiver" :fivresult.data}) });
});



app.get("/worker-rating/:platform/:userId", async (req, res) => {
  const p = req.params['platform']
  const userId = req.params['userId']

  const hashedApiKey = crypto.createHash("sha256").update(p).digest("hex");
  const apiKeyInDB = await prisma.platformApiKey.findFirst({
    where: {
      hashedApiKey,
    },
  });

  if (!apiKeyInDB || apiKeyInDB?.hashedApiKey !== hashedApiKey) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { platform } = apiKeyInDB;

  let existingRating;
  const platformRatingURL = `${CERAMIC_QUERY_URL}/platform-rating/${platform}/${userId}`;
  try {
    const response = await axios.get(platformRatingURL);
    existingRating = response.data;
    res.status(200).json({message: { existingRating }})
  } catch (err) {
    let statusCode = err.response?.status || 500;
    let message = err.response?.data?.message || err.message;
    return res.status(statusCode).json({ message: "p: " + p});
  }

});

app.get("/all-ratings-above/:platform/:userId", async (req, res) => {
  const p = req.params['platform']
  const userId = req.params['userId']
  let apiKey = req.header("platform");

  const hashedApiKey = crypto.createHash("sha256").update(apiKey).digest("hex");
  const apiKeyInDB = await prisma.platformApiKey.findFirst({
    where: {
      hashedApiKey,
    },
  });

  if (!apiKeyInDB || apiKeyInDB?.hashedApiKey !== hashedApiKey) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { platform } = apiKeyInDB;

  let existingRating;
  const platformRatingURL = `${CERAMIC_QUERY_URL}/all-ratings-above/${platform}/${userId}`;
  try {
    const response = await axios.get(platformRatingURL);
    existingRating = response.data;
    res.status(200).json({message: {"rating" : existingRating }})
  } catch (err) {
    let statusCode = err.response?.status || 500;
    let message = err.response?.data?.message || err.message;
    return res.status(statusCode).json({ message: "p: " + p});
  }


});

app.listen(port, () => {
  console.log(`Credential Oracle server listening on the port ${port}`);
});
