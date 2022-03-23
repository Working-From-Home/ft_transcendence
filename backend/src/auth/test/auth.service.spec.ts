import { BadRequestException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service'
import { UsersService } from '../../users/services/users.service'
import { User } from '../../users/entities/user.entity'
import { adjectives, colors, uniqueNamesGenerator } from 'unique-names-generator';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = [];
        fakeUsersService = {
            create: (user: Partial<User>) => {
                if (!user.email) throw new Error('missing requiered fields')
                const newUser = {
                    id: Math.floor(Math.random() * 99999),
                    email: user.email,
                    username: user.username,
                    password: user.password,
                } as User; 
                users.push(newUser);
                return Promise.resolve(newUser);
            },
            findById: (id: number) => {
                const filteredUsers = users.filter(user => user.id === id);
                return Promise.resolve(filteredUsers[0]);
            },
            findByName: (username: string) => {
                const filteredUsers = users.filter(user => user.username === username);
                return Promise.resolve(filteredUsers[0]);
            },
            findByEmail: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers[0]);
            }
        };
        const module = await Test.createTestingModule({
            imports: [
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async (config: ConfigService) => ({
                      secret: 'SECRET',
                      signOptions: { expiresIn: '3600s' },
                    }),
                    inject: [ConfigService],
                })
            ],
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('returns an access_token if a user signs up with valid credentials', async () => {
        const obj = await service.signUpLocal('email@email.fr', 'password');
        expect(obj).toBeDefined();
        expect(obj.access_token).toBeDefined();
        expect(obj.access_token.length).toBeGreaterThan(0);
    });

    it('throws an error if a user signs up with an already used email', async () => {
        await service.signUpLocal('email@email.fr', 'password');
        try {
            await service.signUpLocal('email@email.fr', 'password');
        } catch (err) {
            expect(err).toEqual(new BadRequestException('email in use'));
        }
    });

    it('throws an error if a user signs up with an already used Email', async () => {
        await service.signUpLocal('email@email.fr', 'password');
        try {
            await service.signUpLocal('email@email.fr', 'password');
        } catch (err) {
            expect(err).toEqual(new BadRequestException('email in use'));
        }
    });

    it('returns an access_token if a user signs in with valid credentials', async () => {
        await service.signUpLocal('email@email.fr', 'password');
        const obj = await service.signInLocal('email@email.fr', 'password');
        expect(obj).toBeDefined();
        expect(obj.access_token).toBeDefined();
        expect(obj.access_token.length).toBeGreaterThan(0);
    });

    it('throws an error if a user signs in with an unknown email', async () => {
        try {
            await service.signInLocal('email@email.fr', 'password');
        } catch (err) {
            expect(err).toEqual(new BadRequestException('Email not found.'));
        }
    });

    it('throws an error if a user signs in with an invalid password', async () => {
        await service.signUpLocal('email@email.fr', 'password');
        try {
            await service.signInLocal('email@email.fr', 'badPassword');
        } catch (err) {
            expect(err).toEqual(new BadRequestException('Wrong password, try again.'));
        }
    });
});
