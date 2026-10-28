import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
globalThis['__dirname'] = path.dirname(fileURLToPath(import.meta.url))

import * as runtime from "@prisma/client/runtime/client"
import * as $Class from "./internal/class.js"
import * as Prisma from "./internal/prismaNamespace.js"

export * as $Enums from './enums.js'
export * from "./enums.js"
/**
 * ## Prisma Client
 * 
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more RefreshTokens
 * const refreshTokens = await prisma.refreshToken.findMany()
 * ```
 * 
 * Read more in our [docs](https://pris.ly/d/client).
 */
export const PrismaClient = $Class.getPrismaClientClass()
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>
export { Prisma }
export type RefreshToken = Prisma.RefreshTokenModel
export type VerificationToken = Prisma.VerificationTokenModel
export type Case = Prisma.CaseModel
export type CaseFile = Prisma.CaseFileModel
export type Comment = Prisma.CommentModel
export type Follow = Prisma.FollowModel
export type ModerationItem = Prisma.ModerationItemModel
export type Notification = Prisma.NotificationModel
export type Group = Prisma.GroupModel
export type GroupMember = Prisma.GroupMemberModel
export type Channel = Prisma.ChannelModel
export type Report = Prisma.ReportModel
export type Tag = Prisma.TagModel
export type Theory = Prisma.TheoryModel
export type TheoryUpvote = Prisma.TheoryUpvoteModel
export type User = Prisma.UserModel
