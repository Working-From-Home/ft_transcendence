import { BadRequestException, ClassSerializerInterceptor, Controller,
    Get, NotFoundException, Param, Post, Res, StreamableFile,
    UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { Response } from 'express';
import { AvatarService } from '../services/avatar.service';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { fileFilter } from '../filters/file.filter';

@ApiTags('users')
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AvatarController {
    constructor(private readonly avatarService: AvatarService, private usersService: UsersService) {}

    @Post('users/:id/upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image', fileFilter))
    async uploadAvatar(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        const filename = file?.originalname;
        if (!filename) {
            throw new BadRequestException('File must be a png or jpg/jpeg');
        }
        return await this.usersService.updateAvatar(parseInt(id), file.buffer, filename, file.mimetype);
    }

    @Get('users/:id/avatar')
    @UseGuards(JwtAuthGuard)
    async getAvatar(@Param('id') id: string, @Res({ passthrough: true }) response: Response) {

        const user = await this.usersService.findById(parseInt(id));
        if (!user) { throw new NotFoundException('user not found'); }
        const file = await this.avatarService.getAvatarById(user.avatarId);
        const stream = Readable.from(file.data);
        response.set({ 'Content-Type': file.mimetype });
        return new StreamableFile(stream);
    }

    @Get('avatar/:id')
    async getAvatarById(@Param('id') id: string, @Res({ passthrough: true }) response: Response) {
        const file = await this.avatarService.getAvatarById(parseInt(id));
        const stream = Readable.from(file.data);
        response.set({ 'Content-Type': file.mimetype });
        return new StreamableFile(stream);
    }
}