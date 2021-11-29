import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { GenerateAvatarDto } from '../dtos/generate-avatar.dto';
import { Avatar } from '../entities/avatar.entity';
import { User } from '../entities/user.entity';
const jdenticon = require('jdenticon');

@Injectable()
export class AvatarService {
    constructor(
        @InjectRepository(Avatar) private repo: Repository<Avatar>,
        private connection: Connection) {}

    async create(username: string) {
        const data = this.generate(username);
        const avatar = this.repo.create(data);
        return this.repo.save(avatar);
    }

    async remove(id: number) {
        const avatar = await this.repo.findOne(id);
        if (!avatar) { throw new NotFoundException('avatar not found'); }
        return await this.repo.remove(avatar);
    }

    async findById(id: number) {
        const file = await this.repo.findOne(id);
        if (!file) { throw new NotFoundException('file not found'); }
        return file;
    }

    generate(username: string) {
        const png = jdenticon.toPng(username, 200);
        const data = Buffer.from(png);
        return { filename: username + '.png', data, mimetype: 'image/png' }
    }

    async update(user: User, data: GenerateAvatarDto) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const oldId = user.avatarId;
            const tmp = queryRunner.manager.create(Avatar, data);
            const avatar = await this.repo.save(tmp);
            await queryRunner.manager.update(User, user.id, { avatarId: avatar.id });
            await queryRunner.manager.delete(Avatar, oldId);
            await queryRunner.commitTransaction();
            return avatar;
        } catch {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException();
        } finally {
            await queryRunner.release();
        }
    }
}

