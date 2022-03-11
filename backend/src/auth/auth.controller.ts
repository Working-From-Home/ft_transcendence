import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AcceptUserDto } from './dtos/accept-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/auth/dtos/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/local/signup')
    async createUser(@Body() body: CreateUserDto) {
        return await this.authService.signUpLocal(body.email, body.password);
    }

    @Post('/local/signin')
    async signin(@Body() body: AcceptUserDto) {
        return await this.authService.signInLocal(body.email, body.password);
    }

    @Patch('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
        if (!body.email && !body.username && !body.password) {
            throw new BadRequestException('no field has been filled in');
        }
        return await this.authService.update(id, body);
    }
    
    @Get('/42')
    @UseGuards(AuthGuard('42'))
    async fortyTwo(@Req() req) { }

    @Get('/42/signin')
    @UseGuards(AuthGuard('42'))
    async signInForty(@Req() req) {
        return this.authService.signInFortyTwo(req)
    }

    @Get('/42/signup')
    @UseGuards(AuthGuard('42'))
    async signUpFortyTwo(@Req() req) {
        return this.authService.signUpFortyTwo(req)
    }

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async google() { }
    
    @Get('/google/signin')
    @UseGuards(AuthGuard('google'))
    async signInGoogle(@Req() req) {
        return this.authService.signInGoogle(req)
    }
    @Get('/google/signup')
    @UseGuards(AuthGuard('google'))
    async signUpGoogle(@Req() req) {
        return this.authService.signUpGoogle(req)
    }

    @Post('/refresh')
    @UseGuards(JwtAuthGuard)
    refreshToken() {
        this.authService.refreshToken()
    }

    @Post('/logout')
    @UseGuards(JwtAuthGuard)
    logout() {
        this.authService.logout()
    }
}
