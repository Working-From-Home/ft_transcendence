import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Avatar } from '../entities/avatar.entity';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-initials-sprites';
const svgToImg = require("svg-to-img");
 
@Injectable()
export class AvatarService {
    constructor(@InjectRepository(Avatar) private repo: Repository<Avatar>) {}

    async create(username: string) {
        let svg = createAvatar(style, { seed: username });
        const image = await svgToImg.from(svg).toPng({ encoding: "base64" });
        const buffer = Buffer.from(image, 'base64');
        const avatar = this.repo.create({ filename: 'default.png', data: buffer, mimetype: 'image/png' });
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
 
    async update(dataBuffer: Buffer, filename: string, mimetype: string, queryRunner: QueryRunner) {
        const avatar = queryRunner.manager.create(Avatar, { filename, data: dataBuffer, mimetype });
        return this.repo.save(avatar);
    }

    async removeOld(id: number, queryRunner: QueryRunner) {
        const deleteResponse = await queryRunner.manager.delete(Avatar, id);
        if (!deleteResponse.affected) {
            throw new NotFoundException('file not found');
        }
    }
}