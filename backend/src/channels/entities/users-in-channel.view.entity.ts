import { ViewColumn, ViewEntity } from "typeorm";

/**
 * Just a view entity example to simplify access to data from multiple tables:
 * One of the advantage is to simplify and add abstraction
 * between tables and what the client see. (client == backend)
 */

/** 
 * Return users who are actually in channels. So neither, banned, kicked, or just leaved will be in that list...
 * To get all users from a specific channel, just do a query on this view where channelId == someChannelId
 */
@ViewEntity(
	{
		expression: `
			SELECT uc."userId" AS "userId",
						uc."channelId" AS "channelId",
						(uc."userId" = c."ownerId") AS "isOwner",
						(uc."role" = 'admin') AS "isAdmin",
						uc."mutedUntil" AS mutedUntil
			FROM "user_channel" "uc"
				INNER JOIN "channel" AS "c" ON uc."channelId" = c."id"
			WHERE "hasLeft" = FALSE
		`
	}
)
export class UsersInChannel
{
	@ViewColumn()
	userId: number

	@ViewColumn()
	channelId: number

	@ViewColumn()
	isOwner: boolean

	@ViewColumn()
	isAdmin: boolean

	@ViewColumn()
	mutedUntil: Date
}