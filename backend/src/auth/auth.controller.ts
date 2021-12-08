import { Body, Controller, Post, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AcceptUserDto } from './dtos/accept-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto) {
        return await this.authService.signup(body.email, body.username, body.password);
    }

    @Post('/signin')
    async signin(@Body() body: AcceptUserDto) {
        return await this.authService.signin(body.username, body.password);
    }
}
