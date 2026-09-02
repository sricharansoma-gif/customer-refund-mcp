import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { customers } from "./data.js";
import {
  getCustomerRecordInputSchema,
  triggerRefundInputSchema,
} from "./schemas.js";

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
    async ({ customer_id }) => {
      console.error(`Looking up customer ${customer_id}`);

      const customer = customers[customer_id];

      if (!customer) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "CUSTOMER_NOT_FOUND",
                message: `No customer exists with ID ${customer_id}`,
              }),
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(customer),
          },
        ],
      };
    },
  );

  server.registerTool(
    "trigger_refund",
    {
      description: "Process a mock refund for an existing customer",
      inputSchema: triggerRefundInputSchema,
    },
    async ({ customer_id, amount, reason }) => {
      console.error(`Processing mock refund for ${customer_id}`);

      const customer = customers[customer_id];

      if (!customer) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "CUSTOMER_NOT_FOUND",
                message: `No customer exists with ID ${customer_id}`,
              }),
            },
          ],
          isError: true,
        };
      }

      const refund = {
        refundId: `REF-${Date.now()}`,
        customerId: customer_id,
        amount,
        reason,
        status: "processed",
        processedAt: new Date().toISOString(),
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(refund),
          },
        ],
      };
    },
  );

  return server;
}

void serveStdio(createServer);
console.error("Customer refund MCP server is running on stdio");