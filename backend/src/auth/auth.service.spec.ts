import { BadRequestException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'


describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = [];
        fakeUsersService = {
            create: (email: string, username: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 99999), email, username, password } as User; 
                users.push(user);
                return Promise.resolve(user);
            },
            update: (id: number, attrs: Partial<User>) => {
                const filteredUsers = users.filter(user => user.id === id);
                if (filteredUsers.length === 0) {
                    return null;
                }
                if (attrs.email) {
                    filteredUsers[0].email = attrs.email;
                }
                if (attrs.username) {
                    filteredUsers[0].username = attrs.username;
                }
                if (attrs.password) {
                    filteredUsers[0].password = attrs.password;
                }
                return Promise.resolve(filteredUsers[0]);
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
        const obj = await service.signup('email',  'unusedUsername', 'password');
        expect(obj).toBeDefined();
        expect(obj.access_token).toBeDefined();
        expect(obj.access_token.length).toBeGreaterThan(0);
    });

    it('throws an error if a user signs up with an already used email', async () => {
        await service.signup('email',  'unusedUsername', 'password');
        try {
            await service.signup('email',  'name', 'password');
        } catch (err) {
            expect(err).toEqual(new BadRequestException('email in use'));
        }
    });

    it('throws an error if a user signs up with an already used username', async () => {
        await service.signup('email',  'username', 'password');
        try {
            await service.signup('mail',  'username', 'password');
        } catch (err) {
            expect(err).toEqual(new BadRequestException('username in use'));
        }
    });

    it('returns an access_token if a user signs in with valid credentials', async () => {
        await service.signup('email',  'username', 'password');
        const obj = await service.signin('username', 'password');
        expect(obj).toBeDefined();
        expect(obj.access_token).toBeDefined();
        expect(obj.access_token.length).toBeGreaterThan(0);
    });

    it('throws an error if a user signs in with an unknown username', async () => {
        try {
            await service.signin('name', 'password');
        } catch (err) {
            expect(err).toEqual(new BadRequestException('user not found'));
        }
    });

    it('throws an error if a user signs in with an invalid password', async () => {
        await service.signup('email',  'username', 'password');
        try {
            await service.signin('username', 'badPassword');
        } catch (err) {
            expect(err).toEqual(new BadRequestException('bad password'));
        }
    });
});
