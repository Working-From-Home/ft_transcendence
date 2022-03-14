import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, ForbiddenException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UsersService } from '../users/services/users.service';
import { User } from '../users/entities/user.entity';

const scrypt = promisify(_scrypt);

export interface JwtPayload {
  sub: number,
	isTwoFaAuthenticated : boolean
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signUpLocal(email: string, password: string) {
        if (! await this.isEmailAvailable(email)) {
            throw new BadRequestException('email in use');
        }
        const encryptedPasword = await this.encryptPassword(password);
        const user = await this.usersService.createWithGeneratedUsername(email, encryptedPasword);
        return this.generateAccessToken(user);
    }

    async signInLocal(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('Email not found.');
        }
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Wrong password, try again.');
        }
        return this.generateAccessToken(user);
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

  	generateAccessToken(user: User, isTwoFaAuth = false) {
      const payload: JwtPayload = {sub: user.id, isTwoFaAuthenticated : isTwoFaAuth };
      return {
        id: user.id,
        access_token: this.jwtService.sign(payload)
      } 
  	}

		verifyJwt(jwt: string): Promise<JwtPayload> {
			return this.jwtService.verifyAsync<JwtPayload>(jwt);
		}

  async getPayloadFromToken(token: string): Promise<JwtPayload> {
    return this.jwtService
      .verifyAsync<JwtPayload>(token)
      .then((payload) => {
        return payload;
      })
      .catch((err) => {
        console.log('lol aha -> ', err);
        return null;
      });
  }

  refreshToken() {
    throw new Error('Method not implemented.');
  }

  logout() {
    throw new Error('Method not implemented.');
  }

  async signInWithFortyTwo(req) {
    throw new Error('Method not implemented.');
  }

  async signInWithGoogle(req) {
    if (!req.user) throw new BadRequestException();

    let user: User = (await this.usersService.findBy({ where: [{ googleSub: req.user.sub }] }))[0];
    if (user) return this.generateAccessToken(user[0]);

    user = (await this.usersService.findBy({ where: [{ email: req.user.email }]}))[0];
    if (user)
      throw new ForbiddenException('Your google email is already in use, but your profile is not linked to google.')

    try {
      let newUser = new User()
      newUser.username = "noob" + Math.floor(Math.random() * 90000000) + 1
      newUser.email = req.user.email
      newUser.googleSub = req.user.sub
      newUser.googleAccessToken = req.user.accessToken

      newUser = await this.usersService.store(newUser)
      return this.generateAccessToken(newUser)
    } catch(err) {
      throw new Error(err)
    }
  }

}
