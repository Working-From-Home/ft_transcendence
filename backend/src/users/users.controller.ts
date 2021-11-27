import { Controller, Delete, Get, NotFoundException, Param,
    Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('/:id')
    async findUserById(@Param('id') id: string) {
        const user = await this.usersService.findById(parseInt(id));
        if (!user) { throw new NotFoundException('user not found'); }
        return user;
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    async deleteAccount(@Param('id') id: string) {
        return await this.usersService.remove(parseInt(id));
    }

    @Get()
    async findUserByName(@Query('username') username: string) {
        const user = await this.usersService.findByName(username);
        if (!user) { throw new NotFoundException('user not found'); }
        return user;
    }
}
