import { Controller, DefaultValuePipe, Get, NotFoundException, Query, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UsersPaginationDto } from '../dtos/users-pagination.dto';
import { UserDto } from '../dtos/user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../user.entity';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Serialize(UsersPaginationDto)
    @Get()
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;
        return this.usersService.paginate({ page, limit, route: 'http://localhost:3000/users' });
    }

    @Serialize(UserDto)
    @Get('/:id')
    async findUserById(@Param('id') id: string) {
        const user = await this.usersService.findById(parseInt(id));
        if (!user) { throw new NotFoundException('user not found'); }
        return user;
    }
}
