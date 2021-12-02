import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    NotImplementedException,
    Param,
    Patch,
    Post,
    Put,
    Request,
    Res,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { Express, Response } from 'express';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { AvatarService } from '../services/avatar.service';
import { UsersService } from '../services/users.service';
import { UserDto } from '../dtos/user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../entities/user.entity';
import { fileFilter } from '../filters/file.filter';
import { StatsService } from '../services/stats.service';
// import { FriendshipService } from '../services/friendship.service';

@ApiTags('me')
@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
    constructor(
        private usersService: UsersService,
        private avatarService: AvatarService,
        // private readonly statsService: StatsService
        // private friendshipService: FriendshipService
    ) {}

    @Serialize(UserDto)
    @Get()
    async get(@Request() req: any): Promise<User> {
        const id: number = parseInt(req.user?.userId);
        const user = await this.usersService.findById(id);
        return user;
    }

    @Patch()
    async updateAccount(attrs: Partial<User>) {
        throw new NotImplementedException;
    }

    @Delete()
    async deleteAccount(@Request() req: any) {
        const id: number = parseInt(req.user?.userId);
        const user = await this.usersService.findById(id);
        return await this.usersService.remove(user);
    }



    
    @Put('/avatar')
    @UseInterceptors(FileInterceptor('image', fileFilter))
    async uploadAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
        const id: number = parseInt(req.user?.userId);
        const user = await this.usersService.findById(id);
        if (!file) {
            throw new BadRequestException('file must be a png or jpg/jpeg');
        }
        const data = {
            filename: file.originalname,
            data: file.buffer,
            mimetype:file.mimetype
        };
        return await this.avatarService.update(user, data);
    }

    @Get('/avatar')
    async getAvatar(@Request() req: any, @Res({ passthrough: true }) response: Response) {
        const id: number = parseInt(req.user?.userId);
        const user = await this.usersService.findById(id);
        const stream = Readable.from(user.avatar.data);
        response.set({
            'Content-Type': user.avatar.mimetype
        });
        return new StreamableFile(stream);
    }

    @Delete('/avatar')
    async deleteAvatar(@Request() req: any) {
        const id: number = parseInt(req.user?.userId);
        const user = await this.usersService.findById(id);
        return await this.avatarService.remove(user);
    }


    // @Get('/friends')
    // async getFriends(@Request() req: any) {
    //     const id: number = parseInt(req.user?.userId);
    //     const user = await this.usersService.findById(id);
    //     if (!user) { throw new NotFoundException('user not found'); }
    // }

    // @Post('/friends/:id')
    // async sendFriendRequest(@Request() req: any, @Param('id') id: string) {
    //     const applicantId: number = parseInt(req.user?.userId);
    //     const recipientId = parseInt(id);
    //     const applicant = await this.usersService.findById(applicantId);
    //     if (!applicant) { throw new NotFoundException('user not found'); }
    //     const recipient = await this.usersService.findById(recipientId);
    //     if (!recipient) { throw new NotFoundException('user not found'); }
    //     return await this.friendshipService.sendFriendRequest(applicantId, recipientId);
    // }
}
