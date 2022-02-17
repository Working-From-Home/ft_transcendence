import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    NotImplementedException,
    Param,
    ParseIntPipe,
    Patch,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UsersPaginationDto } from '../dtos/users-pagination.dto';
import { UserDto } from '../dtos/user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUserGuard } from 'src/auth/guards/current-user.guard';
import { ConfigService } from '@nestjs/config';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    private base_url = this.config.get<string>('BACKEND_SERVER_URI');
    
    constructor(
        private usersService: UsersService,
        private config: ConfigService,
    ){}

    @Get()
    @Serialize(UsersPaginationDto)
    async getIndex(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;
        return this.usersService.paginate({ page, limit, route: this.base_url + '/users' });
    }

    @Get('/:id')
    @Serialize(UserDto)
    async findUserById(@Param('id') id: string): Promise<User> {
        const user = await this.usersService.findById(parseInt(id));
        return user;
    }

    @Delete('/:id')
    @UseGuards(CurrentUserGuard)
    @Serialize(UserDto)
    async deleteAccount(@Param('id') id: string): Promise<User> {
        const user = await this.usersService.findById(parseInt(id));
        return await this.usersService.remove(user);
    }
}
