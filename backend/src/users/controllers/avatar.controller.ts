import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Put,
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
import { AvatarService } from '../services/avatar.service';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { fileFilter } from '../filters/file.filter';
import { CurrentUserGuard } from 'src/auth/guards/current-user.guard';
import JwtTwoFaGuard from 'src/auth/guards/jwt-two-fa.guard';

@ApiTags('avatar')
@Controller('/users/:id/avatar')
@UseGuards(JwtAuthGuard)
export class AvatarController {
    constructor(
        private usersService: UsersService,
        private avatarService: AvatarService
    ) {}

    @Get()
    async getUserAvatar(
        @Param('id', ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response
    ) {
        const user = await this.usersService.getUserWithAvatar(id);
        const stream = Readable.from(user.avatar.data);
        response.set({ 'Content-Type': user.avatar.mimetype });
        return new StreamableFile(stream);
    }

    @Put()
    @UseGuards(CurrentUserGuard, JwtTwoFaGuard)
    @UseInterceptors(FileInterceptor('image', fileFilter))
    async uploadAvatar(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @Res({ passthrough: true }) response: Response
    ) {
        if (!file) {
            throw new BadRequestException('file must be a png or jpg/jpeg');
        }
        const user = await this.usersService.findById(id);
        const data = { filename: file.originalname, data: file.buffer, mimetype: file.mimetype };
        const avatar = await this.avatarService.update(user, data);
        const stream = Readable.from(avatar.data);
        response.set({ 'Content-Type': avatar.mimetype });
        return new StreamableFile(stream);
    }

    @Delete()
    @UseGuards(CurrentUserGuard)
    async deleteAvatar(
        @Param('id', ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response
    ) {
        const user = await this.usersService.getUserWithAvatar(id);
        const avatar = await this.avatarService.remove(user);
        const stream = Readable.from(avatar.data);
        response.set({ 'Content-Type': avatar.mimetype });
        return new StreamableFile(stream);
    }
}
