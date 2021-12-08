import { BadRequestException, Body, Controller, Param, ParseIntPipe, Patch, Post, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AcceptUserDto } from './dtos/accept-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/auth/dtos/update-user.dto';

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

    @Patch('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
        if (!body.email && !body.username && !body.password) {
            throw new BadRequestException('no field has been filled in');
        }
        return await this.authService.update(id, body);
    }
}
