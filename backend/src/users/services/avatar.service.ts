import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenerateAvatarDto } from '../dtos/generate-avatar.dto';
import { Avatar } from '../entities/avatar.entity';
import { User } from '../entities/user.entity';
const jdenticon = require('jdenticon');

@Injectable()
export class AvatarService {
    constructor(@InjectRepository(Avatar) private repo: Repository<Avatar>) {}

    async create(user: User) {
        const data = this.generate(user.username);
        const avatar = this.repo.create(data);
        avatar.userId = user.id;
        return await this.repo.save(avatar);
    }

    async update(user: User, data: GenerateAvatarDto) {
        const avatar = await this.repo.findOne(user.id);
        if (!avatar) { throw new NotFoundException('avatar not found'); }
        Object.assign(avatar, data);
        return await this.repo.save(avatar);
    }

    async remove(user: User) {
        const newAvatar = this.generate(user.username);
        return await this.update(user, newAvatar);
    }

    private generate(username: string) {
        const png = jdenticon.toPng(username, 200);
        const data = Buffer.from(png);
        return { filename: username + '.png', data, mimetype: 'image/png' }
    }
}