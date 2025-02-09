import { pgTable, uuid, varchar, timestamp, bigint } from "drizzle-orm/pg-core";
import { AccountTable } from "./Account";

export const TransactionTable = pgTable("transaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  account_id: uuid("account_id").references(() => AccountTable.id, { onDelete: "cascade" }).notNull(),
  amount: bigint("amount", { mode: "number"}).notNull(),
  balance_after: bigint("balance_after", {mode: "number"}).notNull(),
  description: varchar("description", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});
