import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from "@nestjs/typeorm";
import { Connection } from 'typeorm';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { AvatarService } from '../services/avatar.service';
import { Avatar } from '../entities/avatar.entity'
import { StatsService } from '../services/stats.service';
import { Stats } from 'fs';

describe('UsersService', () => {
    let service: UsersService;
    const users: Partial<User>[] = [
        {id: 1, email: "1", username: "1", password: "1"},
        {id: 2, email: "2", username: "2", password: "2"}
    ];

    beforeEach(async () => {
        const fakeRepo = {
            findOne: (id: number) => {
                const user = users.filter(user => user.id === id);
                if (user.length === 0) { return null; }
                return user[0];
            },
            find: (attrs: Partial<User>) => {
                if (attrs.email) {
                    return users.filter(user => user.email === attrs.email);
                }
                if (attrs.username) {
                    return users.filter(user => user.username === attrs.username);
                }
            }
        }
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService, AvatarService, StatsService,
                {
                    provide: getRepositoryToken(User),
                    useValue: fakeRepo
                },
                {
                    provide: Connection, 
                    useValue: 1
                },
                {
                    provide: getRepositoryToken(Avatar),
                    useValue: fakeRepo
                },
                {
                    provide: getRepositoryToken(Stats),
                    useValue: fakeRepo
                }
            ]
        }).compile();
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should find user with an id of 1', async () => {
        const user = await service.findById(1);
        expect(user.email).toEqual("1");
    });

    it('should not find user with an id of 3', async () => {
        const user = await service.findById(3);
        expect(user).toEqual(null);
    });

    it('should find user with an email of "1"', async () => {
        const user = await service.findByEmail("1");
        expect(user.username).toEqual("1");
    });

    it('should not find user with an email of "3"', async () => {
        const user = await service.findByEmail("3");
        expect(user).toEqual(null);
    });

    it('should find user with a username of "1"', async () => {
        const user = await service.findByEmail("1");
        expect(user.email).toEqual("1");
    });

    it('should not find user with a username of "3"', async () => {
        const user = await service.findByName("3");
        expect(user).toEqual(null);
    });
});
