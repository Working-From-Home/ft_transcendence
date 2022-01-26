import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message) private repo: Repository<Message>
    ) {}

    // TO DO
    async create(): Promise<Message> {
        return new Message; // tmp
    }

    // TO DO
    async update(): Promise<Message> {
        return new Message; // tmp
    }

    async remove(message: Message): Promise<Message> {
        return await this.repo.remove(message);
    }

    async findById(id: number): Promise<Message> {
        const message = await this.repo.findOne(id);
        if (!message) { throw new NotFoundException('message not found'); }
        return message;
    }
}
