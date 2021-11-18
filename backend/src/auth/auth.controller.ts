import { Body, Controller, Post } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../dtos/user.dto'
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SignUserInDto } from 'src/dtos/sign-user-in.dto';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
    constructor(private usersService: UsersService, private authService: AuthService) {}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto) {
        const user = await this.authService.signup(body.email, body.username, body.password);
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: SignUserInDto) {
        const user = await this.authService.signin(body.username, body.password);
        return user;
    }
}
