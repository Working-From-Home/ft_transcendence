import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Avatar } from '../entities/avatar.entity';
import { createCanvas } from 'canvas';
 
@Injectable()
export class AvatarService {
    constructor(@InjectRepository(Avatar) private repo: Repository<Avatar>) {}

    async create(dataBuffer: Buffer, filename: string, mimetype: string,) {
        const avatar = this.repo.create({ filename, data: dataBuffer, mimetype });
        return this.repo.save(avatar);
    }

    async remove(id: number) {
        const avatar = await this.repo.findOne(id);
        if (!avatar) { throw new NotFoundException('avatar not found'); }
        return await this.repo.remove(avatar);
    }

    async findById(id: number) {
        const file = await this.repo.findOne(id);
        if (!file) {
            throw new NotFoundException('file not found');
        }
        return file;
    }
 
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

    generate(username: string, size: number) {
        var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        let params = {
            width: size,
            height: size,
            font: size / 2.5 + 'px sans-serif',
            bgColor: randomColor,
            color: this.invertColor(randomColor)
        }
        let initials = username.toUpperCase().match(/\b(\w)/g).join('');
        const canvas = createCanvas(params.width, params.height);
        const ctx = canvas.getContext('2d');
        ctx.globalAlpha = 1;
        ctx.fillStyle = params.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.7;
        ctx.font=params.font;
        ctx.fillStyle = params.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(initials, canvas.width / 2, canvas.height / 2);
        return canvas.toBuffer();
    }

    private invertColor(hex: string) {
        var color = parseInt(hex.substring(1), 16);
        color = 0xFFFFFF ^ color;
        var inverted = color.toString(16);
        inverted = ("000000" + color).slice(-6);
        return '#' + inverted;
    }
}