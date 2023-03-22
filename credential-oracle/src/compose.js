import { ComposeClient } from "@composedb/client";
import { definition } from "./__generated__/definition.js";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays";

if (!process.env.CERAMIC_NODE_URL) {
  console.error("Missing env variable - CERAMIC_NODE_URL");
  process.exit(1);
}

if (!process.env.DID_PRIVATE_KEY) {
  console.error("Missing env variable - DID_PRIVATE_KEY");
  process.exit(1);
}

const compose = new ComposeClient({
  ceramic: process.env.CERAMIC_NODE_URL,
  definition,
});

const key = fromString(process.env.DID_PRIVATE_KEY, "base16");
const did = new DID({
  provider: new Ed25519Provider(key),
  resolver: getResolver(),
});
await did.authenticate();

compose.setDID(did);

export { compose };
