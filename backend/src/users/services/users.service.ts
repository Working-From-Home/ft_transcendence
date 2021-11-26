import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Connection, Repository } from 'typeorm'
import { User } from '../entities/user.entity';
import { AvatarService } from './avatar.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        private readonly avatarService: AvatarService,
        private connection: Connection
    ) {}

    async create(email: string, username: string, password: string) {
        const avatar = await this.avatarService.create(username);
        const user = this.repo.create({ email, username, password, avatar });
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findById(id);
        if (!user) { throw new NotFoundException('user not found'); }
        return await this.avatarService.remove(user.avatarId);
    }

    findById(id: number) {
        if (!id) { return null; }
        return this.repo.findOne(id);
    }

    async findByEmail(email: string) {
        const users = await this.repo.find({ email });
        if (users.length === 0) { return null; }
        return users[0];
    }

    async findByName(username: string) {
        const users = await this.repo.find({ username });
        if (users.length === 0) { return null; }
        return users[0];
    }

    async updateAvatar(id: number, imageBuffer: Buffer, filename: string, mimetype: string) {
        const user = await this.findById(id);
        if (!user) { throw new  NotFoundException('user not found'); }
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const oldId = user.avatarId;
            const avatar = await this.avatarService.update(imageBuffer, filename, mimetype, queryRunner);
            await queryRunner.manager.update(User, id, { avatarId: avatar.id });
            if (oldId) {
                await this.avatarService.removeOld(oldId, queryRunner);
            }
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
