import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import {
  getCustomerRecordInputSchema,
  triggerRefundInputSchema,
} from "./schemas.js";
import {
  handleGetCustomerRecord,
  handleTriggerRefund,
} from "./tools.js";

function createServer(): McpServer {
  const server = new McpServer({
    name: "customer-refund-mcp",
    version: "1.0.0",
  });

  server.registerTool(
    "get_customer_record",
    {
      description: "Retrieve a customer record using a customer ID",
      inputSchema: getCustomerRecordInputSchema,
    },
    handleGetCustomerRecord,
  );

  server.registerTool(
    "trigger_refund",
    {
      description: "Process a mock refund for an existing customer",
      inputSchema: triggerRefundInputSchema,
    },
    handleTriggerRefund,
  );

  return server;
}

void serveStdio(createServer);
console.error("Customer refund MCP server is running on stdio");
