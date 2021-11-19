import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SignUserInDto } from '../dtos/sign-user-in.dto';
import { UpdateUserDto } from '../dtos/update-user.dto'

@Controller('auth')
export class AuthController {
    constructor(private usersService: UsersService, private authService: AuthService) {}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto) {
        const access_token = await this.authService.signup(body.email, body.username, body.password);
        return access_token;
    }

    @Post('/signin')
    async signin(@Body() body: SignUserInDto) {
        const access_token = await this.authService.signin(body.username, body.password);
        return access_token;
    }

    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        const user = await this.authService.update(parseInt(id), body);
        return user;
    }
}
