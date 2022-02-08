import { Controller, Param, ParseIntPipe, Post, UseGuards, Req, Body } from '@nestjs/common';
import { CurrentUserGuard } from 'src/auth/guards/current-user.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Channel } from '../entities/channel.entity';
import { createParamDecorator } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { CreateChannelDto } from '../dtos/create-channel.dto';

@Controller('channels')
@UseGuards(JwtAuthGuard)
export class ChannelsController {
	constructor(private chatService: ChatService) { }

	@Post('/dm/:destId')
	async createDm(
		@Req() request,
		@Param('destId', ParseIntPipe) destId: number)
		: Promise<Channel> {
		return await this.chatService.createDm(parseInt(request.user.userId), destId);
	}

	@Post('/channel')
	async createChannel(
		@Req() request,
		@Body() data: CreateChannelDto)
		: Promise<Channel> {
		return await this.chatService.createChannel(parseInt(request.user.userId), data);
	}
}
