import test from "node:test";
import assert from "node:assert/strict";

import {
  getCustomerRecordInputSchema,
  triggerRefundInputSchema,
} from "../src/schemas.js";

test("accepts a correctly formatted customer ID", () => {
  const result = getCustomerRecordInputSchema.safeParse({
    customer_id: "CUST-12345",
  });

  assert.equal(result.success, true);
});

test("rejects malformed customer IDs", () => {
  const invalidIds = [
    "CUST-1234",
    "CUST-123456",
    "cust-12345",
    "CUSTOMER-12345",
    "CUST-12A45",
  ];

  for (const customer_id of invalidIds) {
    const result = getCustomerRecordInputSchema.safeParse({
      customer_id,
    });

    assert.equal(result.success, false);
  }
});

test("accepts a valid refund request", () => {
  const result = triggerRefundInputSchema.safeParse({
    customer_id: "CUST-12345",
    amount: 25.5,
    reason: "Customer was charged twice",
  });

  assert.equal(result.success, true);
});

test("rejects zero and negative refund amounts", () => {
  const invalidAmounts = [0, -1, -25.5];

  for (const amount of invalidAmounts) {
    const result = triggerRefundInputSchema.safeParse({
      customer_id: "CUST-12345",
      amount,
      reason: "Customer was charged twice",
    });

    assert.equal(result.success, false);
  }
});

test("rejects short and whitespace-only reasons", () => {
  const invalidReasons = [
    "Mistake",
    "          ",
    "   short   ",
  ];

  for (const reason of invalidReasons) {
    const result = triggerRefundInputSchema.safeParse({
      customer_id: "CUST-12345",
      amount: 25.5,
      reason,
    });

    assert.equal(result.success, false);
  }
});

test("trims a valid refund reason", () => {
  const result = triggerRefundInputSchema.safeParse({
    customer_id: "CUST-12345",
    amount: 25.5,
    reason: "   Customer was charged twice   ",
  });

  assert.equal(result.success, true);

  if (result.success) {
    assert.equal(result.data.reason, "Customer was charged twice");
  }
});

test("rejects a refund reason longer than 500 characters", () => {
  const result = triggerRefundInputSchema.safeParse({
    customer_id: "CUST-12345",
    amount: 25.5,
    reason: "a".repeat(501),
  });

  assert.equal(result.success, false);
});