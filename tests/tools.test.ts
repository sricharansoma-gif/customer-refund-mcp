import test from "node:test";
import assert from "node:assert/strict";

import {
  handleGetCustomerRecord,
  handleTriggerRefund,
} from "../src/tools.js";

function parseText(result: { content: [{ type: "text"; text: string }] }) {
  return JSON.parse(result.content[0].text) as Record<string, unknown>;
}

test("get_customer_record returns an existing customer", async () => {
  const result = await handleGetCustomerRecord({ customer_id: "CUST-12345" });
  const body = parseText(result);

  assert.equal(result.isError, undefined);
  assert.equal(body.customerId, "CUST-12345");
  assert.equal(body.status, "active");
});

test("get_customer_record returns a structured error for an unknown customer", async () => {
  const result = await handleGetCustomerRecord({ customer_id: "CUST-99999" });
  const body = parseText(result);

  assert.equal(result.isError, true);
  assert.equal(body.error, "CUSTOMER_NOT_FOUND");
});

test("trigger_refund returns a successful mock refund", async () => {
  const result = await handleTriggerRefund({
    customer_id: "CUST-12345",
    amount: 25.5,
    reason: "Customer was charged twice",
  });
  const body = parseText(result);

  assert.equal(result.isError, undefined);
  assert.equal(body.customerId, "CUST-12345");
  assert.equal(body.amount, 25.5);
  assert.equal(body.reason, "Customer was charged twice");
  assert.equal(body.status, "processed");
  assert.match(String(body.refundId), /^REF-\d+$/);
  assert.doesNotThrow(() => new Date(String(body.processedAt)).toISOString());
});

test("trigger_refund returns a structured error for an unknown customer", async () => {
  const result = await handleTriggerRefund({
    customer_id: "CUST-99999",
    amount: 25.5,
    reason: "Customer was charged twice",
  });
  const body = parseText(result);

  assert.equal(result.isError, true);
  assert.equal(body.error, "CUSTOMER_NOT_FOUND");
});
