import { CeramicClient } from "@ceramicnetwork/http-client";
import { Composite } from "@composedb/devtools";
import {
  readEncodedComposite,
  writeEncodedComposite,
} from "@composedb/devtools-node";

import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.CERAMIC_NODE_URL) {
  console.error("Missing env variable - CERAMIC_NODE_URL.");
  process.exit(1);
}

const ceramic = new CeramicClient(process.env.CERAMIC_NODE_URL);

const loadSources = [
  "github_user_composite.json",
  "fiverr_profile_composite.json",
  "platform_rating_composite.json",
].map(async (path) => await readEncodedComposite(ceramic, path));

const sourceComposites = await Promise.all(loadSources);
const mergedComposite = Composite.from(sourceComposites);

await writeEncodedComposite(mergedComposite, "merged_composite.json");
