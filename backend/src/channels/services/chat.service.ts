import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";
import { InjectRepository } from "@nestjs/typeorm";
import { getManager, getRepository, Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Channel } from "../entities/channel.entity";
import { Message } from "../entities/message.entity";
import { UserChannel } from "../entities/user-channel.entity";
import { CreateChannelDto } from "../dtos/create-channel.dto";
import { ISearchChannel, IUserChannel, IChannel } from "shared/models/socket-events";
import { UsersService } from "src/users/services/users.service";
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    @InjectRepository(UserChannel) private userChannelRepo: Repository<UserChannel>,
    @InjectRepository(Message) private MessageRepo: Repository<Message>,
	private readonly usersService : UsersService,
  ) { }

  /* Create */

  async createDm(userIdOne: number, userIdTwo: number) {
    return await getManager().transaction(async entityManager => {
      const newDm = new Channel();
      newDm.isDm = true;
	  let userTmpOne = await this.usersService.findById(userIdOne);
	  let userTmpTwo = await this.usersService.findById(userIdTwo);
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

  async joinChannel(channelId: number, userId: number) {
    let channel = await this.userChannelRepo.findOne({where: [{userId, channelId}]})
	if (channel) {
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
    return await this.userChannelRepo.update(channelUser, attrs);
  }

  async leaveChannel(channelId: number, userId: number) {
    let channel = await this.userChannelRepo.findOneOrFail({where: [{userId, channelId}]})
    channel.hasLeft = true;
    return this.userChannelRepo.save(channel);
  }

  async addAdmin(channelId: number, adminId: number, userId: number) {
    await this.findChannelById(channelId);
    if (!this.isAdmin(adminId, channelId) || this.isOwner(userId, channelId))
      throw new UnauthorizedException('You cannot promote this user');
    return this.updateUserChannel(userId, channelId, { role: 'admin' });
  }

  async removeAdmin(channelId: number, adminId: number, userId: number) {
    await this.findChannelById(channelId);
    if (!this.isAdmin(adminId, channelId) || this.isOwner(userId, channelId))
      throw new UnauthorizedException('You cannot remove this admin');
    return this.updateUserChannel(userId, channelId, { role: 'user' });
  }

  async banUser(channelId: number, adminId: number, userId: number, date: Date) {
    await this.findChannelById(channelId);
    if (!this.isAdmin(adminId, channelId) || this.isOwner(userId, channelId))
      throw new UnauthorizedException('You cannot ban this user');
    return this.updateUserChannel(userId, channelId, { bannedUntil: date, hasLeft: true });
  }

  async muteUser(channelId: number, adminId: number, userId: number, date: Date) {
    await this.findChannelById(channelId);
    if (!this.isAdmin(adminId, channelId) || this.isOwner(userId, channelId))
      throw new UnauthorizedException('You cannot mute this user');
    return this.updateUserChannel(userId, channelId, { mutedUntil: date });
  }

  async unbanUser(channelId: number, adminId: number, userId: number) {
    await this.findChannelById(channelId);
    if (!this.isAdmin(adminId, channelId) || this.isOwner(userId, channelId))
      throw new UnauthorizedException('You cannot unban this user');
    return this.updateUserChannel(userId, channelId, { bannedUntil: null });
  }

  async unmuteUser(channelId: number, adminId: number, userId: number) {
    await this.findChannelById(channelId);
    if (!this.isAdmin(adminId, channelId) || this.isOwner(userId, channelId))
      throw new UnauthorizedException('You cannot unmute this user');
    return this.updateUserChannel(userId, channelId, { mutedUntil: null });
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

  async isOwner(userId: number, channelId: number): Promise<boolean> {
    const channel = await getRepository(Channel)
      .createQueryBuilder("channel")
      .where("channel.id = :id", { id: channelId })
      .getOne();
    return channel.owner.id === userId;
  }

  async searchChannelsByTitle(title: string): Promise<ISearchChannel[]> {
    return getRepository(Channel)
      .createQueryBuilder("channel")
      .where("title like :name ", { name: `%${title}%` })
	  .where('channel."isDm" = false')
      .select(["channel.id", "channel.title"])
      .getMany();
  }

  async getUsersOfChannel(channelId: number) {
	const y = await getManager().connection.query(
		`SELECT uc."userId" AS "_id",
				uc."channelId" AS "channelId",
				(uc."userId" = c."ownerId") AS "isOwner",
				(uc."role" = 'admin') AS "isAdmin",
				uc."mutedUntil" AS "mutedUntil",
				u.username AS "username"
		FROM "user_channel" uc
			INNER JOIN "channel" c ON uc."channelId" = c."id"
			INNER JOIN "user" u ON uc."userId" = u."id"
		WHERE "channelId" IN (${channelId}) AND uc."hasLeft"=FALSE`
	  );
	return y;
  }

  async getMessagesOfChannel(channelId: number) {
	return getRepository(Message)
       .createQueryBuilder("m")
	   .leftJoin("m.user", "u")
	   .leftJoin("m.channel", "channel")
       .where(`channel.id = ${channelId}`)
	   .select([
		   'm.id AS "_id"', 
	   	   'm.content AS "content"',
		   'u.id AS "senderId"',
		   'u.username AS "username"',
		])
       .getRawMany();
  }
  async getChannelsOfUser(userId: number): Promise<IChannel[]> {
	const a = await getManager().connection.query(
		`SELECT c.id AS "roomId",
				c."isDm",
				c.title AS "roomName",
				c."createdAt"
		FROM Channel c
		LEFT JOIN user_channel u
			ON u."channelId" = c.id
		WHERE u."userId"=(${userId}) AND u."hasLeft"=FALSE`
	  );
	return a;
  }
  async getChannel(channelId: number): Promise<IChannel[]> {
	const a = await getManager().connection.query(
		`SELECT c.id AS "roomId",
				c."isDm",
				c.title AS "roomName",
				c."createdAt"
		FROM Channel c
		WHERE c."id"=(${channelId})`
	  );
	return a;
  }


  // async getUsersInChannel(channelId: number): Promise<UsersInChannel[]> {
  //   return getRepository(UsersInChannel)
  //     .createQueryBuilder("u")
  //     .where("u.channelId = 1")
  //     .getRawMany();
  // }
}
