import { CeramicClient } from "@ceramicnetwork/http-client";
import { readEncodedComposite } from "@composedb/devtools-node";

import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";

import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.GITHUB_USER_MODEL_STREAM_ID) {
  console.error("Missing env variable - GITHUB_USER_MODEL_STREAM_ID.");
  process.exit(1);
}

if (!process.env.CERAMIC_NODE_URL) {
  console.error("Missing env variable - CERAMIC_NODE_URL.");
  process.exit(1);
}

if (!process.env.COMPOSITE_FILE_NAME) {
  console.error("Missing env variable - COMPOSITE_FILE_NAME.");
  process.exit(1);
}

if (!process.env.DID_PRIVATE_KEY) {
  console.error("Missing env variable - DID_PRIVATE_KEY.");
  process.exit(1);
}

const compositeFileName = process.env.COMPOSITE_FILE_NAME;
const privateKey = fromString(process.env.DID_PRIVATE_KEY, "base16");

const did = new DID({
  resolver: getResolver(),
  provider: new Ed25519Provider(privateKey),
});

try {
  await did.authenticate();
} catch (err) {
  console.error(`Failed to authenticate did - ${err?.message}`);
  process.exit(1);
}

const ceramic = new CeramicClient(process.env.CERAMIC_NODE_URL);
ceramic.did = did;

let composite;
try {
  composite = await readEncodedComposite(ceramic, compositeFileName);
} catch (err) {
  console.error(
    `Error while trying to read encoded composite - ${err?.message}`
  );
  process.exit(1);
}

try {
  await composite.startIndexingOn(ceramic);
} catch (err) {
  console.error(
    `Error while trying to notify the node to index the models - ${err?.message}`
  );
  process.exit(1);
}
