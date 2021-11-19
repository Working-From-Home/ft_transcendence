import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AcceptUserDto } from './dtos/accept-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto'

@Controller('auth')
export class AuthController {
    constructor(private usersService: UsersService, private authService: AuthService) {}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto) {
        const access_token = await this.authService.signup(body.email, body.username, body.password);
        return access_token;
    }

    @Post('/signin')
    async signin(@Body() body: AcceptUserDto) {
        const access_token = await this.authService.signin(body.username, body.password);
        return access_token;
    }

    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        const user = await this.authService.update(parseInt(id), body);
        return user;
    }
}
