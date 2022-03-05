import { Controller, Param, ParseIntPipe, Post, UseGuards, Req, Body, Patch, Delete, Put } from '@nestjs/common';
import { CurrentUserGuard } from 'src/auth/guards/current-user.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Channel } from '../entities/channel.entity';
import { createParamDecorator } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { CreateChannelDto } from '../dtos/create-channel.dto';
import { UserChannel } from '../entities/user-channel.entity';
import { UpdateResult } from 'typeorm';
import { AppGateway } from 'src/app.gateway';
import { OnlineService } from 'src/online.service';
import { IChannel, IMessage } from 'shared/models/socket-events';
import { Message } from "../entities/message.entity";
@Controller()
@UseGuards(JwtAuthGuard)
export class ChannelsController {
	constructor(private chatService: ChatService,
				private readonly appGateway: AppGateway
				) { }

	@Post('/dm/:destId')
	async createDm(
		@Req() request,
		@Param('destId', ParseIntPipe) destId: number
	): Promise<Channel> {
		const user = this.appGateway.server.in(`user:${request.user.sub}` );
		let newChannel = await this.chatService.createDm(parseInt(request.user.sub), destId);
		user.socketsJoin(`channel:${newChannel.id}`);
		this.chatService.getChannel(newChannel.id).then( (y) => {
		 	this.appGateway.server.in("channel:" + newChannel.id).emit("sendChannel", y);
		})
		return newChannel;
	}

	@Post('/channels')
	async createChannel(
		@Req() request,
		@Body() data: CreateChannelDto
	): Promise<Channel> {
		const user = this.appGateway.server.in(`user:${request.user.sub}` );
		let newChannel = await this.chatService.createChannel(parseInt(request.user.sub), data);
		user.socketsJoin(`channel:${newChannel.id}`);
		this.chatService.getChannel(newChannel.id).then( (y) => {
		 	this.appGateway.server.in("channel:" + newChannel.id).emit("sendChannel", y);
		})
		return newChannel;
	}

	@Post('/channels/:channelId/messages')
	async createMessage(
		@Req() request,
		@Param('channelId') channelId: number,
		@Body() content: any
	): Promise<IMessage[]> {
		let tmpMessage = await this.chatService.createMessage(channelId, request.user.sub, content);
		let newMessage: IMessage[];
		newMessage = [{
			_id: tmpMessage.id,
			username: tmpMessage.user.username,
			content: tmpMessage.content,
			createdAt: tmpMessage.createdAt.toString(),
			date: tmpMessage.createdAt.toDateString(),
			senderId: tmpMessage.user.id,
			channelId: tmpMessage.channel.id
		}]
		this.appGateway.server.in("channel:" + channelId).emit("sendMessage", newMessage);
		return newMessage;
	}

	@Patch('/channels/:channelId')
	async updateChannel(
		@Param('channelId') channelId: number,
		@Body() data: CreateChannelDto
	): Promise<UpdateResult> {
		return await this.chatService.updateChannel(channelId, data);
	}

	@Put('/channels/:channelId')
	async joinChannel(
		@Req() request,
		@Param('channelId') channelId: number
	): Promise<UserChannel> {
		let newUserChannel : UserChannel;
		newUserChannel = await this.chatService.joinChannel(channelId, parseInt(request.user.sub));
		const user = this.appGateway.server.in(`user:${request.user.sub}` );
		user.socketsJoin(`channel:${channelId}`);
		this.chatService.getChannel(channelId).then( (y) => {
		 	this.appGateway.server.in("channel:" + channelId).emit("sendChannel", y);
		})
		return newUserChannel;
	}

	@Delete('/channels/:channelId')
    async leaveChannel(
        @Req() request,
        @Param('channelId') channelId: number ) {
        let updateResult = await this.chatService.leaveChannel(channelId, parseInt(request.user.sub));
        const user = this.appGateway.server.in(`user:${request.user.sub}` ).socketsLeave(`channel:${channelId}`)
		this.chatService.getChannel(channelId).then( (y) => {
	 	 	this.appGateway.server.in("channel:" + channelId).emit("sendChannel", y);
	 	})
		this.appGateway.server.in("user:" + request.user.sub).emit("leaveChannel", channelId);
    }

	@Put('/channels/:channelId/mute/:userId')
	async muteUser(
		@Req() request,
		@Param('channelId') channelId: number,
		@Param('userId') userId: number,
		@Body() date: Date
	): Promise<UpdateResult> {
		const adminId = parseInt(request.user.sub);
		if (!date)
			return await this.chatService.unmuteUser(channelId, adminId, userId);
		return await this.chatService.muteUser(channelId, adminId, userId, date);
	}

	@Put('/channels/:channelId/ban/:userId')
	async banUser(
		@Req() request,
		@Param('channelId') channelId: number,
		@Param('userId') userId: number,
		@Body() date: Date
	): Promise<UpdateResult> {
		const adminId = parseInt(request.user.sub);
		if (!date)
			return await this.chatService.unbanUser(channelId, adminId, userId);
		return await this.chatService.banUser(channelId, adminId, userId, date);
	}

	@Put('/channels/:channelId/admin/:userId')
	async addAdmin(
		@Req() request,
		@Param('channelId') channelId: number,
		@Param('userId') userId: number,
	): Promise<UpdateResult> {
		return await this.chatService.addAdmin(channelId, parseInt(request.user.sub), userId);
	}

	@Delete('/channels/:channelId/admin/:userId')
	async removeAdmin(
		@Req() request,
		@Param('channelId') channelId: number,
		@Param('userId') userId: number,
	): Promise<UpdateResult> {
		return await this.chatService.removeAdmin(channelId, parseInt(request.user.sub), userId);
	}
}
