import {
    Controller,
    DefaultValuePipe,
    Get,
    Param,
    ParseIntPipe,
    Query,
    Res,
    StreamableFile,
    UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Readable } from 'stream';
import { Response } from 'express';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UsersPaginationDto } from '../dtos/users-pagination.dto';
import { UserDto } from '../dtos/user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Serialize(UsersPaginationDto)
    @Get()
    async getIndex(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;
        return this.usersService.paginate({ page, limit, route: 'http://localhost:3000/users' });
    }

    @Serialize(UserDto)
    @Get('/:id')
    async findUserById(@Param('id') id: string) {
        const user = await this.usersService.findById(parseInt(id));
        return user;
    }

    @Get('/:id/avatar')
    async getUserAvatar(@Param('id') id: string, @Res({ passthrough: true }) response: Response) {
        const user = await this.usersService.findById(parseInt(id));
        const stream = Readable.from(user.avatar.data);
        response.set({ 'Content-Type': user.avatar.mimetype });
        return new StreamableFile(stream);
    }
}
