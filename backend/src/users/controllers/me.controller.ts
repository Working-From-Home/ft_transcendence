import { Controller, Delete, Get, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UsersService } from '../users.service';
import { UserDto } from '../dtos/user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../user.entity';

@ApiTags('me')
@Controller('me')
@Serialize(UserDto)
@UseGuards(JwtAuthGuard)
export class MeController {
    constructor(private usersService: UsersService) {}

    @Get()
    async get(@Request() req: any): Promise<User> {
        const id: number = parseInt(req.user?.userId);
        const user = await this.usersService.findById(id);
        if (!user) { throw new NotFoundException('user not found'); }
        return user;
    }

    @Delete()
    async deleteAccount(@Request() req: any) {
        const id: number = parseInt(req.user?.userId);
        const user = await this.usersService.findById(id);
        if (!user) { throw new NotFoundException('user not found'); }
        return await this.usersService.remove(id);
    }
}
