import { BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UsersService } from '../users/services/users.service';
import { User } from '../users/entities/user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signup(email: string, username: string, password: string) {
        if (! await this.isEmailAvailable(email)) {
            throw new BadRequestException('email in use');
        }
        if (! await this.isUsernameAvailable(username)) {
            throw new BadRequestException('username in use');
        }
        const encryptedPasword = await this.encryptPassword(password);
        const user = await this.usersService.create(email, username, encryptedPasword);
        return { id: user.id, access_token: this.generateAccessToken(user) };
    }

    async signin(username: string, password: string) {
        const user = await this.usersService.findByName(username);
        if (!user) {
            throw new NotFoundException('user not found');
        }
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }
        return { id: user.id, access_token: this.generateAccessToken(user) };
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.usersService.findById(id);
        if (attrs.email && ! await this.isEmailAvailable(attrs.email)) {
            throw new UnauthorizedException('email already in use');
        }
        if (attrs.username && ! await this.isUsernameAvailable(attrs.username)) {
            throw new UnauthorizedException('username already in use');
        }
        if (attrs.password) {
            attrs.password = await this.encryptPassword(attrs.password);
        }
        return user;
    }

    private async isEmailAvailable(email: string): Promise<boolean> {
        const user = await this.usersService.findByEmail(email);
        if (user) { return false; }
        return true;
    }

    private async isUsernameAvailable(username: string): Promise<boolean> {
        const user = await this.usersService.findByName(username);
        if (user) { return false; }
        return true;
    }

    private async encryptPassword(password: string): Promise<string> {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = salt + '.' + hash.toString('hex');
        return result;
    }

    private generateAccessToken(user: User): string {
        const payload = { username: user.username, sub: user.id };
        return this.jwtService.sign(payload);
    }
}
