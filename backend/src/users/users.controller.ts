import { Body, Controller, Get, NotFoundException, Param, Patch, Query } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto'

@Controller('users')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('/:id')
    async findUserById(@Param('id') id: string) {
        const user = await this.usersService.findById(parseInt(id));
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }

    @Get()
    async findUserByName(@Query('username') username: string) {
        const user = await this.usersService.findByName(username);
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }
}
