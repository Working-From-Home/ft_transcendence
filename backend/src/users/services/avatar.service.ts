import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Avatar } from '../entities/avatar.entity';
 
@Injectable()
export class AvatarService {
    constructor(@InjectRepository(Avatar) private repo: Repository<Avatar>) {}
 
    async uploadAvatar(dataBuffer: Buffer, filename: string, mimetype: string, queryRunner: QueryRunner) {
        const avatar = queryRunner.manager.create(Avatar, { filename, data: dataBuffer, mimetype });
        return this.repo.save(avatar);
    }

    async deleteAvatar(id: number, queryRunner: QueryRunner) {
        const deleteResponse = await queryRunner.manager.delete(Avatar, id);
        if (!deleteResponse.affected) {
            throw new NotFoundException('file not found');
        }
    }

    async removeAvatar(id: number) {
        const avatar = await this.repo.findOne(id);
        if (!avatar) { throw new NotFoundException('avatar not found'); }
        return await this.repo.remove(avatar);
    }
 
    async getAvatarById(id: number) {
        const file = await this.repo.findOne(id);
        if (!file) {
            throw new NotFoundException('file not found');
        }
        return file;
    }
}