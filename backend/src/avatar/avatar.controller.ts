import { BadRequestException, ClassSerializerInterceptor, Controller,
    Delete, Get, NotFoundException, Param, Post, Query, Res, StreamableFile,
    UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { Express, Response } from 'express';
import { AvatarService } from './avatar.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { fileFilter } from './filters/file.filter';

@ApiTags('avatar')
@Controller('/users/:id/avatar')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class AvatarController {
    constructor(private readonly avatarService: AvatarService, private usersService: UsersService) {}

    @Post()
    @UseInterceptors(FileInterceptor('image', fileFilter))
    async uploadAvatar(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        const user = await this.usersService.findById(parseInt(id));
        if (!user) { throw new NotFoundException('user not found'); }
        if (!file) {  throw new BadRequestException('file must be a png or jpg/jpeg'); }
        const data = { filename: file.originalname, data: file.buffer, mimetype:file.mimetype };
        return await this.avatarService.update(user, data);
    }

    @Get()
    async getAvatar(@Param('id') id: string, @Res({ passthrough: true }) response: Response) {
        const user = await this.usersService.findById(parseInt(id));
        if (!user) { throw new NotFoundException('user not found'); }
        const file = await this.avatarService.findById(user.avatarId);
        const stream = Readable.from(file.data);
        response.set({ 'Content-Type': file.mimetype });
        return new StreamableFile(stream);
    }

    @Delete()
    async deleteAvatar(@Param('id') id: string) {
        const user = await this.usersService.findById(parseInt(id));
        if (!user) { throw new NotFoundException('user not found'); }
        const data = this.avatarService.generate(user.username);
        return await this.avatarService.update(user, data);
    }

    // @Get()
    // async getAvatarById(@Query('id') id: string, @Res({ passthrough: true }) response: Response) {
    //     const file = await this.avatarService.findById(parseInt(id));
    //     const stream = Readable.from(file.data);
    //     response.set({ 'Content-Type': file.mimetype });
    //     return new StreamableFile(stream);
    // }
}