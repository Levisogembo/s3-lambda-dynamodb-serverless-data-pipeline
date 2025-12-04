import { decryptEnvVar } from './kmsDecryption.mjs'
import { processSingleS3Upload } from './dynamoDb.mjs'

await decryptEnvVar("TABLE_NAME");
const TABLE_NAME = process.env.TABLE_NAME

export const handler = async (event, context) => {
  const record = event.Records[0]
  const results = await processSingleS3Upload(record, TABLE_NAME)
  console.log("Results", results);
  return {
    statusCode: results.success ? 200 : 500,
    body: JSON.stringify(results)
  };
};