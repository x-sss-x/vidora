import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { initCols } from "./column.helpers";

export type MuxStatus = "asset_created" | "preparing" | "ready" | "errored";

export type ResolutionTier =
	| "audio-only"
	| "720p"
	| "1080p"
	| "1440p"
	| "2160p"
	| undefined;

export const video = pgTable(
	"video",
	(d) => ({
		...initCols,
		title: d.varchar({ length: 256 }).notNull(),
		description: d.text(),
		createdById: d
			.varchar({ length: 255 })
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		status: d.text().$type<MuxStatus>().notNull(),
		maxResolutionTier: d.text().$type<ResolutionTier>(),
		uploadId: d.text().notNull(),
		assetId: d.text(),
		duration: d.doublePrecision().default(0).notNull(),
		playbackId: d.text(),
	}),
	(t) => [
		index("created_by_idx").on(t.createdById),
		index("name_idx").on(t.title),
	],
);

export const videoRelations = relations(video, ({ one, many }) => ({
	creator: one(user, { fields: [video.createdById], references: [user.id] }),
	watchListEntries: many(watchList),
}));

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified")
		.$defaultFn(() => false)
		.notNull(),
	image: text("image"),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
	updatedAt: timestamp("updated_at").$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
});

export const watchList = pgTable(
	"watch_list",
	(d) => ({
		userId: d
			.text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		videoId: d
			.text()
			.notNull()
			.references(() => video.id, { onDelete: "cascade" }),
		createdAt: timestamp({ withTimezone: true })
			.$defaultFn(() => new Date())
			.notNull(),
	}),
	(t) => [
		primaryKey({ columns: [t.userId, t.videoId] }),
		index("watch_list_user_idx").on(t.userId),
		index("watch_list_video_idx").on(t.videoId),
	],
);

export const userRelations = relations(user, ({ many }) => ({
	account: many(account),
	session: many(session),
	watchListEntries: many(watchList),
}));

export const watchListRelations = relations(watchList, ({ one }) => ({
	user: one(user, { fields: [watchList.userId], references: [user.id] }),
	video: one(video, { fields: [watchList.videoId], references: [video.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, { fields: [session.userId], references: [user.id] }),
}));
