import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";
import { InjectRepository } from "@nestjs/typeorm";
import { getManager, getRepository, Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Channel } from "../entities/channel.entity";
import { Message } from "../entities/message.entity";
import { UserChannel } from "../entities/user-channel.entity";
import { CreateChannelDto } from "../dtos/create-channel.dto";
import { ISearchChannel, IChannel, IUserChannel, IMessage } from "shared/models/socket-events";
import { UsersService } from "src/users/services/users.service";
import { Blocked } from 'src/users/entities/blocked.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    @InjectRepository(UserChannel) private userChannelRepo: Repository<UserChannel>,
    @InjectRepository(Message) private MessageRepo: Repository<Message>,
	@InjectRepository(Blocked) private blockRepo: Repository<Blocked>,
	private readonly usersService : UsersService,
  ) { }

  /* Create */

  async createDm(userIdOne: number, userIdTwo: number) {
    return await getManager().transaction(async entityManager => {
      const newDm = new Channel();
      newDm.isDm = true;
	  let error = '';
	  let userTmpOne = await this.usersService.findById(userIdOne);
	  let userTmpTwo = await this.usersService.findById(userIdTwo);
	  let y = await this.getChannelsOfUser(userIdOne)
	  for (const obj of y){
		if (obj.isDm){
			let users = await this.getUsersOfChannel(obj.roomId)
			for (const user of users) { 
				if (user._id === userIdTwo){
					throw new UnauthorizedException("You're already in a conversation with " + userTmpTwo.username);
				}
			}
		}
	  }
	  newDm.title = `${userTmpOne.username} and ${userTmpTwo.username}`;
      await entityManager.save(newDm);

      const userOne = new UserChannel();
      userOne.userId = userIdOne;
      userOne.channelId = newDm.id;
      await entityManager.save(userOne);

      const userTwo = new UserChannel();
      userTwo.userId = userIdTwo;
      userTwo.channelId = newDm.id;
      await entityManager.save(userTwo);

      return newDm;
    })
  }

  async createChannel(ownerId: number, data: CreateChannelDto) {
	let channels = await this.searchChannelsByTitle(data.title);
	for (const obj of channels) {
		if (data.title = obj.title)
			throw new UnauthorizedException("This Channel already in use");
	}
    return await getManager().transaction(async entityManager => {
      const tmpOwner = new User();
      tmpOwner.id = ownerId;

      const newChannel = new Channel();
      newChannel.title = data.title;
      newChannel.password = data.password;
      newChannel.owner = tmpOwner;
      newChannel.isDm = false;
      await entityManager.save(newChannel);

      const owner = new UserChannel();
      owner.userId = ownerId;
      owner.channelId = newChannel.id;
      owner.role = 'admin';
      await entityManager.save(owner);
      return newChannel;
    });
  }

  async createMessage(channelId: number, userId: number, content: any): Promise<Message> {
	  return await getManager().transaction(async entityManager => {
      const newMessage = new Message();
      newMessage.content = content.message;
      newMessage.channel = await this.findChannelById(channelId);
      newMessage.user =  await this.usersService.findById(userId);
      await entityManager.save(newMessage);
      return newMessage;
    });
  }

  async joinChannel(channelId: number, userId: number, data: any) {
    let channel = await this.userChannelRepo.findOne({where: [{userId, channelId}]})
	let tmpChannel = await this.findChannelById(channelId);
	if ((tmpChannel.password != null && tmpChannel.password != '') && tmpChannel.password != data.password) {
		throw new UnauthorizedException('Wrong Password')
	}
	if (channel) {
		if (channel.bannedUntil != null){
			const d = new Date();
			let time = d.getTime() + 3600000;
			let myTime = channel.bannedUntil.getTime()
			if (time < myTime)
				throw new UnauthorizedException('You are banned from this room until ' + channel.bannedUntil.toDateString())
			else
				channel.bannedUntil = null;
		}
		channel.hasLeft = false;
    	return this.userChannelRepo.save(channel);
	}
    const channelUser = this.userChannelRepo.create({ userId, channelId });
    await this.userChannelRepo.save(channelUser);
    return channelUser;
  }

  /* Update */

  async updateChannel(channelId: number, attrs: Partial<Channel>) {
    const channel = await this.findChannelById(channelId);
    if (this.isChannelDM(channel.id))
      throw new UnauthorizedException('This channel cannot be updated');
    return await this.channelRepo.update(channel, attrs);
  }
  
  private async updateUserChannel(userId: number, channelId: number, attrs: Partial<UserChannel>) {
    const channelUser = await this.userChannelRepo.findOne({
      where: [{ userId, channelId }]
    });
    if (!channelUser)
      throw new NotFoundException('user not found');
	channelUser.mutedUntil = attrs.mutedUntil
    return await this.userChannelRepo.save(channelUser);
  }

  async leaveChannel(channelId: number, userId: number) {
    let channel = await this.userChannelRepo.findOneOrFail({where: [{userId, channelId}]})
    channel.hasLeft = true;
    return this.userChannelRepo.save(channel);
  }

  async addAdmin(channelId: number, adminId: number, userId: number) {
    await this.findChannelById(channelId);
    if (await !this.isAdmin(adminId, channelId) || await this.isOwner(userId, channelId))
      throw new UnauthorizedException('You cannot promote this user');
	const channelUser = await this.userChannelRepo.findOne({
		where: [{ userId, channelId }]
	});
	if (!channelUser)
      throw new NotFoundException('user not found');
	channelUser.role = 'admin';
	return this.userChannelRepo.save(channelUser);
  }

  async removeAdmin(channelId: number, adminId: number, userId: number) {
    await this.findChannelById(channelId);
    if (!this.isAdmin(adminId, channelId) || this.isOwner(userId, channelId))
      throw new UnauthorizedException('You cannot remove this admin');
    return this.updateUserChannel(userId, channelId, { role: 'user' });
  }

  async banUser(channelId: number, adminId: number, userId: number, date: Date) {
    await this.findChannelById(channelId);
    if (await !this.isAdmin(adminId, channelId) || await this.isOwner(userId, channelId))
      throw new UnauthorizedException('You cannot ban this user');
	const channelUser = await this.userChannelRepo.findOne({
		where: [{ userId, channelId }]
	});
	if (!channelUser)
      throw new NotFoundException('user not found');
	channelUser.bannedUntil = date;
	return this.userChannelRepo.save(channelUser);
  }

  async muteUser(channelId: number, adminId: number, userId: number, date: Date) {
    await this.findChannelById(channelId);
    if (await !this.isAdmin(adminId, channelId) || await this.isOwner(userId, channelId))
      throw new UnauthorizedException('You cannot mute this user');
	const channelUser = await this.userChannelRepo.findOne({
		where: [{ userId, channelId }]
	});
	if (!channelUser)
      throw new NotFoundException('user not found');
	channelUser.mutedUntil = date;
	return this.userChannelRepo.save(channelUser);
  }

  async unbanUser(channelId: number, adminId: number, userId: number) {
    await this.findChannelById(channelId);
    if (await !this.isAdmin(adminId, channelId) || await this.isOwner(userId, channelId))
      throw new UnauthorizedException('You cannot unban this user');
	  const channelUser = await this.userChannelRepo.findOne({
		where: [{ userId, channelId }]
	});
	if (!channelUser)
      throw new NotFoundException('user not found');
	channelUser.bannedUntil = null;
	return this.userChannelRepo.save(channelUser);
  }

  async unmuteUser(channelId: number, adminId: number, userId: number) {
    await this.findChannelById(channelId);
    if (await !this.isAdmin(adminId, channelId) || await this.isOwner(userId, channelId))
      throw new UnauthorizedException('You cannot unmute this user');
	const channelUser = await this.userChannelRepo.findOne({
		where: [{ userId, channelId }]
	});
	if (!channelUser)
      throw new NotFoundException('user not found');
	channelUser.mutedUntil = null;
    return this.userChannelRepo.save(channelUser);
  }

	async blockUser(applicantId: number, recipientId: number) {
		if (applicantId === recipientId) {
			throw new BadRequestException;
		}
		const applicant = await this.usersService.findById(applicantId);
		const recipient = await this.usersService.findById(recipientId);
		const blocked = this.blockRepo.create({ applicant, recipient });
		return await this.blockRepo.save(blocked);
	}
	async unBlockUser(unblock: Blocked[]) {
		return await this.blockRepo.remove(unblock);
	}
  /* Remove */

  async removeChannel(channel: Channel): Promise<Channel> {
    return await this.channelRepo.remove(channel);
  }

  async removeMessage(message: Message): Promise<Message> {
    return await this.MessageRepo.remove(message);
  }

  /* Getters */

  async findChannelById(id: number): Promise<Channel> {
    const channel = await this.channelRepo.findOne(id);
    if (!channel)
      throw new NotFoundException('channel not found');
    return channel;
  }

  async findChannelsByIds(ids: number[]): Promise<Channel[]> {
    const channels = await this.channelRepo.findByIds(ids);
    return channels;
  }

  async paginateChannels(options: IPaginationOptions): Promise<Pagination<Channel>> {
    const queryBuilder = this.channelRepo.createQueryBuilder('channel');
    queryBuilder.orderBy('channel.createdAt', 'DESC');
    return paginate<Channel>(queryBuilder, options);
  }

  async isChannelPublic(channelId: number): Promise<boolean> {
    const channel = await this.findChannelById(channelId);
    return channel.password === null && channel.isDm === false;
  }

  async isChannelDM(channelId: number): Promise<boolean> {
    const channel = await this.findChannelById(channelId);
    return channel.isDm;
  }

  async isBanned(userId: number, channelId: number): Promise<boolean> {
    const channelUser = await this.userChannelRepo.findOne({ where: [{ userId, channelId }] });
    if (!channelUser)
      throw new NotFoundException('user not found');
    return channelUser.bannedUntil !== null;
  }

  async isMuted(userId: number, channelId: number): Promise<boolean> {
    const channelUser = await this.userChannelRepo.findOne({ where: [{ userId, channelId }] });
    if (!channelUser)
      throw new NotFoundException('user not found');
    return channelUser.mutedUntil !== null;
  }

  async isAdmin(userId: number, channelId: number): Promise<boolean> {
    const channelUser = await this.userChannelRepo.findOne({ where: [{ userId, channelId }] });
    if (!channelUser)
      throw new NotFoundException('user not found');
    return channelUser.role === 'admin';
  }

  async isBlocked(applicantId: number): Promise<Blocked[]>  {
	const applicant = await this.usersService.findById(applicantId);
	return await this.blockRepo.find({
		where: [{ applicant}]
	});
  }
  async getBlocked(applicantId: number, recipientId: number): Promise<Blocked[]>  {
	const applicant = await this.usersService.findById(applicantId);
	const recipient = await this.usersService.findById(recipientId);
	return await this.blockRepo.find({
		where: [{ applicant, recipient}]
	});
  }
  

  async isOwner(userId: number, channelId: number): Promise<boolean> {
    const channel = await getRepository(Channel)
      .createQueryBuilder("channel")
      .where("channel.id = :id", { id: channelId })
	  .leftJoinAndSelect("channel.owner", "o")
      .getOne();
    return channel.owner.id === userId;
  }

  async searchChannelsByTitle(title: string): Promise<ISearchChannel[]> {
	  return await getManager().connection.query(
		`SELECT channel.id AS "id",
				channel.title AS title,
				(channel."password" != '') AS "isPassword"
		  FROM "channel" channel
		  WHERE title LIKE ('%${title}%') AND channel."isDm"=FALSE`
	  );
  }

  async searchUsersByTitle(data: {title: string, channelId: number}): Promise<IUserChannel[]> {
	const y = await getManager().connection.query(
		`SELECT uc."userId" AS "_id",
				uc."channelId" AS "channelId",
				(uc."role" = 'admin') AS "isAdmin",
				uc."mutedUntil" AS "mutedUntil",
				u.username AS "username",
				uc."hasLeft" AS "hasLeft",
				uc."bannedUntil" AS "bannedUntil"
		FROM "user_channel" uc
			INNER JOIN "channel" c ON uc."channelId" = c."id"
			INNER JOIN "user" u ON uc."userId" = u."id"
		WHERE "channelId" IN (${data.channelId}) AND uc."hasLeft"=FALSE AND username LIKE ('%${data.title}%')`
	  );
	return y;
  }

  async getUsersOfChannel(channelId: number): Promise<IUserChannel[]> {
	const y = await getManager().connection.query(
		`SELECT uc."userId" AS "_id",
				uc."channelId" AS "channelId",
				(uc."userId" = c."ownerId") AS "isOwner",
				(uc."role" = 'admin') AS "isAdmin",
				uc."mutedUntil" AS "mutedUntil",
				uc."bannedUntil" AS "bannedUntil",
				u.username AS "username"
		FROM "user_channel" uc
			INNER JOIN "channel" c ON uc."channelId" = c."id"
			INNER JOIN "user" u ON uc."userId" = u."id"
		WHERE "channelId" IN (${channelId}) AND uc."hasLeft"=FALSE`
	  );
	return y;
  }

  async getMessagesOfChannel(channelId: number): Promise<Message[]> {
	return getRepository(Message)
       .createQueryBuilder("m")
	   .leftJoin("m.user", "u")
	   .leftJoin("m.channel", "channel")
       .where(`channel.id = ${channelId}`)
	   .select([
		   'm.id AS "_id"', 
	   	   'm.content AS "content"',
		   `m."createdAt" AS "createdAt"`, 
		   'u.id AS "senderId"',
		   'u.username AS "username"',
		])
		.orderBy("m.id")
       .getRawMany();
  }
  async getChannelsOfUser(userId: number): Promise<IChannel[]> {
	const a = await getManager().connection.query(
		`SELECT c.id AS "roomId",
				c."isDm",
				c.title AS "roomName",
				c."createdAt",
				(c."password" != '') AS "isPassword"
		FROM Channel c
		LEFT JOIN user_channel u
			ON u."channelId" = c.id
		WHERE u."userId"=(${userId}) AND u."hasLeft"=FALSE AND u."bannedUntil" IS NULL`
	  );
	return a;
  }
  async getChannel(channelId: number): Promise<IChannel[]> {
	const a = await getManager().connection.query(
		`SELECT c.id AS "roomId",
				c."isDm",
				c.title AS "roomName",
				c."createdAt",
				(c."password" != '') AS "isPassword"
		FROM Channel c
		WHERE c."id"=(${channelId})`
	  );
	return a;
  }
}
