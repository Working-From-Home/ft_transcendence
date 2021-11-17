import { Body, Controller, Delete, Get, NotFoundException,
    Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { SignUserInDto } from './dtos/sign-user-in.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService) {}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto) {
        const user = await this.authService.signup(body.email, body.username, body.password);
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: SignUserInDto) {//, @Session() session: any) {
        const user = await this.authService.signin(body.username, body.password);
        // session.userId = user.id;
        return user;
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        const user = await this.authService.update(parseInt(id), body);
        return user;
    }

    @Get('/:id')
    async findUserById(@Param('id') id: string) {
        const user = await this.usersService.findById(parseInt(id));
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Get()
    findUserByName(@Query('username') username: string) {
        return this.usersService.findByName(username);
    }
}
