import { customers } from "./data.js";

interface TextContent {
  type: "text";
  text: string;
}

export interface ToolResult {
  content: [TextContent];
  isError?: true;
}

function textResult(payload: unknown, isError = false): ToolResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload),
      },
    ],
    ...(isError ? { isError: true as const } : {}),
  };
}

export async function handleGetCustomerRecord({
  customer_id,
}: {
  customer_id: string;
}): Promise<ToolResult> {
  const customer = customers[customer_id];

  if (!customer) {
    return textResult(
      {
        error: "CUSTOMER_NOT_FOUND",
        message: `No customer exists with ID ${customer_id}`,
      },
      true,
    );
  }

  return textResult(customer);
}

export async function handleTriggerRefund({
  customer_id,
  amount,
  reason,
}: {
  customer_id: string;
  amount: number;
  reason: string;
}): Promise<ToolResult> {
  const customer = customers[customer_id];

  if (!customer) {
    return textResult(
      {
        error: "CUSTOMER_NOT_FOUND",
        message: `No customer exists with ID ${customer_id}`,
      },
      true,
    );
  }

  return textResult({
    refundId: `REF-${Date.now()}`,
    customerId: customer_id,
    amount,
    reason,
    status: "processed",
    processedAt: new Date().toISOString(),
  });
}
