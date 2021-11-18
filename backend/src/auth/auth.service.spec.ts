import { BadRequestException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { User } from '../users/user.entity'

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
            findById: (id: number) => {
                const filteredUsers = users.filter(user => user.id === id);
                return Promise.resolve(filteredUsers[0]);
            },
            findByName: (username: string) => {
                const filteredUsers = users.filter(user => user.username === username);
                return Promise.resolve(filteredUsers);
            },
            findByEmail: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            }
        };
        const module = await Test.createTestingModule({
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

    it('can create a new user with a salted and hashed password', async () => {
        const user = await service.signup('mail', 'username', 'password');
        expect(user.password).not.toEqual('password');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('email',  'unusedUsername', 'password');
        try {
            await service.signup('email',  'name', 'password');
        } catch (err) {
            expect(err).toEqual(new BadRequestException('Email in use'));
        }
    });

    it('throws an error if user signs up with username that is in use', async () => {
        await service.signup('email',  'username', 'password');
        try {
            await service.signup('mail',  'username', 'password');
        } catch (err) {
            expect(err).toEqual(new BadRequestException('Username in use'));
        }
    });

    it('throws an error if signin is called with unused username', async () => {
        try {
            await service.signin('name', 'password');
        } catch (err) {
            expect(err).toEqual(new BadRequestException('User not found'));
        }
    });

    it('throws an error if an invalid password is provided', async () => {
        await service.signup('email',  'username', 'password');
        try {
            await service.signin('username', 'badPassword');
        } catch (err) {
            expect(err).toEqual(new BadRequestException('Bad password'));
        }
    });

    it('returns a user if a correct password is provided', async () => {
        await service.signup('email',  'username', 'password');
        const user = await service.signin('username', 'password');
        expect(user).toBeDefined();
    });
});
