import { BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async signup(email: string, username: string, password: string) {
        const emailisAvailable = await this.isEmailAvailable(email);
        if (!emailisAvailable) {
            throw new BadRequestException('Email in use');
        }
        const usernameisAvailable = await this.isUsernameAvailable(username);
        if (!usernameisAvailable) {
            throw new BadRequestException('Username in use');
        }
        const encryptedPasword = await this.encryptPassword(password);
        const user = await this.usersService.create(email, username, encryptedPasword);
        return user;
    }

    async signin(username: string, password: string) {
        const [user] = await this.usersService.findByName(username);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Bad password');
        }
        const payload = { username: user.username, sub: user.id };
        return {"access_token": this.jwtService.sign(payload) };
    }

    async update(id: number, attrs: Partial<User>) {
        if (attrs.email) {
            const emailisAvailable = await this.isEmailAvailable(attrs.email);
            if (!emailisAvailable) {
                throw new BadRequestException('Email in use');
            }
        }
        if (attrs.username) {
            const usernameisAvailable = await this.isUsernameAvailable(attrs.username);
            if (!usernameisAvailable) {
                throw new BadRequestException('Username in use');
            }
        }
        if (attrs.password) {
            const encryptedPasword = await this.encryptPassword(attrs.password);
            attrs.password = encryptedPasword;
        }
        const user = await this.usersService.update(id, attrs);
        return user;
    }

    private async isEmailAvailable(email: string) {
        const users = await this.usersService.findByEmail(email);
        if (users.length) {
            return false;
        }
        return true;
    }

    private async isUsernameAvailable(username: string) {
        const users = await this.usersService.findByName(username);
        if (users.length) {
            return false;
        }
        return true;
    }

    private async encryptPassword(password: string) {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = salt + '.' + hash.toString('hex');
        return result;
    }
}
