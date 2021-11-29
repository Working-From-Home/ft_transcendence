import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
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

@ApiTags('me')
@Controller('me')
// @UseGuards(JwtAuthGuard)
export class MeController {
    constructor(
        private usersService: UsersService,
        private avatarService: AvatarService
    ) {}

    @Serialize(UserDto)
    @Get()
    async get(@Request() req: any): Promise<User> {
        const id: number = parseInt(req.user?.userId);
        const user = await this.usersService.findById(id);
        if (!user) { throw new NotFoundException('user not found'); }
        return user;
    }

    @Delete()
    async deleteAccount(@Request() req: any) {
        const id: number = parseInt(req.user?.userId);
        const user = await this.usersService.findById(id);
        if (!user) { throw new NotFoundException('user not found'); }
        return await this.usersService.remove(id);
    }

    @Post('/avatar')
    @UseInterceptors(FileInterceptor('image', fileFilter))
    async uploadAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
        const id: number = parseInt(req.user?.userId);
        const user = await this.usersService.findById(id);
        if (!user) { throw new NotFoundException('user not found'); }
        if (!file) {  throw new BadRequestException('file must be a png or jpg/jpeg'); }
        const data = { filename: file.originalname, data: file.buffer, mimetype:file.mimetype };
        return await this.avatarService.update(user, data);
    }

    @Get('/avatar')
    async getAvatar(@Request() req: any, @Res({ passthrough: true }) response: Response) {
        const id: number = parseInt(req.user?.userId);
        const user = await this.usersService.findById(id);
        if (!user) { throw new NotFoundException('user not found'); }
        const file = await this.avatarService.findById(user.avatarId);
        const stream = Readable.from(file.data);
        response.set({ 'Content-Type': file.mimetype });
        return new StreamableFile(stream);
    }

    @Delete('/avatar')
    async deleteAvatar(@Request() req: any) {
        const id: number = parseInt(req.user?.userId);
        const user = await this.usersService.findById(id);
        if (!user) { throw new NotFoundException('user not found'); }
        const data = this.avatarService.generate(user.username);
        return await this.avatarService.update(user, data);
    }
}
