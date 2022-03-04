import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Head,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UsersPaginationDto } from '../dtos/users-pagination.dto';
import { UserDto } from '../dtos/user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUserGuard } from 'src/auth/guards/current-user.guard';
import { UpdateUserDto } from 'src/auth/dtos/update-user.dto';

@ApiTags('users')
@Controller()
@UseGuards(JwtAuthGuard)
export class UsersController {    
    constructor(private usersService: UsersService){}

    @Get('/users')
    @Serialize(UsersPaginationDto)
    async getIndex(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;
        return await this.usersService.paginate({ page, limit, route: '/users'});
    }

    @Get('/users/:id')
    @Serialize(UserDto)
    async findUserById(@Param('id') id: string): Promise<User> {
        const user = await this.usersService.findById(parseInt(id));
        return user;
    }

    @Delete('/users')
    @Serialize(UserDto)
    async deleteAccount(@Req() request): Promise<User> {
        const user = await this.usersService.findById(parseInt(request.user.sub));
        return await this.usersService.remove(user);
    }

    @Patch('/users')
    async update(@Req() request, @Body() body: UpdateUserDto) {
        return await this.usersService.update(parseInt(request.user.sub), body);
    }

    @Head('/username/:username')
    @Serialize(UserDto)
    async usernameExists(@Param('username') username: string) {
        const n = await this.usersService.countBy({ where: [{ username: username }]} );
        if (!n)
            throw new NotFoundException('Username does not exists.');
    }
}
