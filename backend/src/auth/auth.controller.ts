import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AcceptUserDto } from './dtos/accept-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

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

    @UseGuards(JwtAuthGuard)
    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        const user = await this.authService.update(parseInt(id), body);
        return user;
    }
}
