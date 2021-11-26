import { BadRequestException, ClassSerializerInterceptor, Controller,
    Get, NotFoundException, Param, Post, Query, Res, StreamableFile,
    UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { Express, Response } from 'express';
import { AvatarService } from '../services/avatar.service';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { fileFilter } from '../filters/file.filter';

@ApiTags('avatar')
@Controller('avatar')
@UseInterceptors(ClassSerializerInterceptor)
export class AvatarController {
    constructor(private readonly avatarService: AvatarService, private usersService: UsersService) {}

    @Post('/:userId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image', fileFilter))
    async uploadAvatar(@Param('userId') id: string, @UploadedFile() file: Express.Multer.File) {
        const filename = file?.originalname;
        if (!filename) {
            throw new BadRequestException('File must be a png or jpg/jpeg');
        }
        return await this.usersService.updateAvatar(parseInt(id), file.buffer, filename, file.mimetype);
    }

    @Get('/:userId')
    @UseGuards(JwtAuthGuard)
    async getAvatar(@Param('userId') id: string, @Res({ passthrough: true }) response: Response) {

        const user = await this.usersService.findById(parseInt(id));
        if (!user) { throw new NotFoundException('user not found'); }
        const file = await this.avatarService.findById(user.avatarId);
        const stream = Readable.from(file.data);
        response.set({ 'Content-Type': file.mimetype });
        return new StreamableFile(stream);
    }

    @Get()
    async getAvatarById(@Query('id') id: string, @Res({ passthrough: true }) response: Response) {
        const file = await this.avatarService.findById(parseInt(id));
        const stream = Readable.from(file.data);
        response.set({ 'Content-Type': file.mimetype });
        return new StreamableFile(stream);
    }
}