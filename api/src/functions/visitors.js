// Azure Function: visitor counter
// Every time the resume page loads, it calls POST /api/visitors.
// This function reads the current count from Azure Table Storage,
// adds 1, saves it back and returns the new number to the page.

const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");

// The connection string is NOT written in the code.
// It is read from an environment variable set in the Azure portal.
const tableClient = TableClient.fromConnectionString(
  process.env.STORAGE_CONNECTION_STRING,
  "visitors"
);

app.http("visitors", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    let count = 0;

    try {
      // Each row in a table is found by two keys: PartitionKey and RowKey.
      const entity = await tableClient.getEntity("counter", "resume");
      count = entity.count;
    } catch (error) {
      // 404 means the row does not exist yet (first visit ever). Any other error is real.
      if (error.statusCode !== 404) {
        context.error("Failed to read the counter", error);
        return { status: 500, jsonBody: { error: "Could not read the visitor count." } };
      }
    }

    count += 1;

    await tableClient.upsertEntity(
      { partitionKey: "counter", rowKey: "resume", count },
      "Replace"
    );

    return { jsonBody: { count } };
  },
});
