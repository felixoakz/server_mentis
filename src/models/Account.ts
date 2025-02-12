import { pgTable, uuid, varchar, timestamp, unique } from "drizzle-orm/pg-core";
import { UserTable } from "models/User";

export const AccountTable = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => UserTable.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
}, (table) => [
  unique().on(table.user_id, table.name) // Create a unique constraint combining user_id and name
]);
