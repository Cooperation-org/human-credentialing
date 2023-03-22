import { CeramicClient } from "@ceramicnetwork/http-client";
import { writeEncodedCompositeRuntime } from "@composedb/devtools-node";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.COMPOSITE_FILE_NAME) {
  console.error("Missing env variable - COMPOSITE_FILE_NAME.");
  process.exit(1);
}

if (!process.env.CERAMIC_NODE_URL) {
  console.error("Missing env variable - CERAMIC_NODE_URL.");
  process.exit(1);
}

const ceramic = new CeramicClient(process.env.CERAMIC_NODE_URL);
try {
  await writeEncodedCompositeRuntime(
    ceramic,
    process.env.COMPOSITE_FILE_NAME,
    "src/__generated__/definition.js"
  );
  console.log(
    "Successfully created runtime definition file at __generated__/definition.js"
  );
} catch (err) {
  console.error(err);
  process.exit(1);
}
