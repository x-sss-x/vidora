import { init as initCuid2 } from "@paralleldrive/cuid2";
import { text, timestamp } from "drizzle-orm/pg-core";

const cuid2 = initCuid2({ length: 8 }); //12345678

export const initCols = {
	id: text()
		.notNull()
		.primaryKey()
		.$defaultFn(() => cuid2()),
	createdAt: timestamp({ withTimezone: true })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
};
