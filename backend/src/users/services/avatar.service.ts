import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenerateAvatarDto } from '../dtos/generate-avatar.dto';
import { Avatar } from '../entities/avatar.entity';
import { User } from '../entities/user.entity';
const jdenticon = require('jdenticon');

@Injectable()
export class AvatarService {
    constructor(
        @InjectRepository(Avatar) private repo: Repository<Avatar>) {}

    async create(username: string) {
        const data = this.generate(username);
        const avatar = this.repo.create(data);
        return await this.repo.save(avatar);
    }

    async update(user: User, data: GenerateAvatarDto) {
        Object.assign(user.avatar, data);
        return await this.repo.save(user.avatar);
    }

    async remove(user: User) {
        const newAvatar = this.generate(user.username);
        return this.update(user, newAvatar);
    }

    private generate(username: string) {
        const png = jdenticon.toPng(username, 200);
        const data = Buffer.from(png);
        return { filename: username + '.png', data, mimetype: 'image/png' }
    }
}