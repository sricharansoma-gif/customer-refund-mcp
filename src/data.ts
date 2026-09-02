export interface CustomerRecord {
  customerId: string;
  name: string;
  email: string;
  status: "active" | "inactive";
}

export const customers: Record<string, CustomerRecord> = {
  "CUST-12345": {
    customerId: "CUST-12345",
    name: "Alex Johnson",
    email: "alex@example.com",
    status: "active",
  },
  "CUST-67890": {
    customerId: "CUST-67890",
    name: "Priya Sharma",
    email: "priya@example.com",
    status: "active",
  },
};