import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { Channel } from "./entities/channel.entity";
import { UsersInChannel } from "./entities/users-in-channel.view.entity";
// tmp
import {
  ISearchChannel,
  UserChannel,
  IChannel,
} from "shared/models/socket-events";

@Injectable()
export class ChatTmpService {
  constructor() {}

  async searchChannelsByTitle(title: string): Promise<ISearchChannel[]> {
    return getRepository(Channel)
      .createQueryBuilder("channel")
      .where("title like :name ", { name: `%${title}%` })
      .select(["channel.id", "channel.title"])
      .getMany();
  }
  async searchChannelsUsers(userId: string): Promise<IChannel[]> {
    return getRepository(Channel)
      .createQueryBuilder("channel")
      .leftJoin("channel.userChannels", "uc")
      .where("uc.userId = 1")
      .andWhere("uc.hasLeft = FALSE")
      .select([
        "id",
        '"isDm"',
        'title AS "roomName"',
        'channel.createdAt AS "createdAt"',
      ])
      .getRawMany();
  }
}
