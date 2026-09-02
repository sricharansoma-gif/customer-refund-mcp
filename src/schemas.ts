import * as z from "zod/v4";

export const customerIdSchema = z
  .string()
  .regex(/^CUST-\d{5}$/, "customer_id must match the format CUST-XXXXX");

export const getCustomerRecordInputSchema = z.object({
  customer_id: customerIdSchema,
});

export const triggerRefundInputSchema = z.object({
  customer_id: customerIdSchema,
  amount: z
    .number()
    .positive("amount must be greater than zero"),
  reason: z
  .string()
  .trim()
  .min(10, "reason must contain at least 10 non-whitespace characters")
  .max(500, "reason must not exceed 500 characters"),
});