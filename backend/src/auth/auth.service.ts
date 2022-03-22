import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, ForbiddenException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UsersService } from '../users/services/users.service';
import { User } from '../users/entities/user.entity';

const scrypt = promisify(_scrypt);

interface JwtPayload {
  sub: number;
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
        const user = await this.usersService.create({
          email,
          password: encryptedPasword,
        });
        return this.generateAccessToken(user);
    }

    async signInLocal(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new NotFoundException('Email not found.');
        if (user.googleSub)
            throw new NotFoundException('This account has been created via google. Please sign in with google.');
        if (user.fortyTwoSub)
            throw new NotFoundException('This account has been created via 42. Please sign in with 42.');
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

  private generateAccessToken(user: User) {
      const payload: JwtPayload = {sub: user.id };
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

  logout(userId: number) {
    this.usersService.update(userId, {refreshToken: null});
  }

  async signInFortyTwo(req) {
    if (!req.user) throw new BadRequestException('Something went very wrong');
  
    let user = (await this.usersService.findBy({ where: [{ fortyTwoSub: req.user.sub }] }))[0];
    if (!user)
      throw new ForbiddenException('42 account not found, register instead ?');
    return this.generateAccessToken(user);
  }

  async signInGoogle(req) {
    if (!req.user) throw new BadRequestException('Something went very wrong');
  
    let user = (await this.usersService.findBy({ where: [{ googleSub: req.user.sub }] }))[0];
    if (!user)
      throw new ForbiddenException('Google account not found, register instead ?');
    return this.generateAccessToken(user);
  }

  async signUpFortyTwo(req) {
    if (!req.user) throw new BadRequestException();

    let user = (await this.usersService.findBy({ where: [{ fortyTwoSub: req.user.sub }] }))[0];
    if (user)
      throw new ForbiddenException('This account already exists. Please sign in with 42 instead.');

    user = (await this.usersService.findBy({ where: [{ email: req.user.email }]}))[0];
    if (user)
      throw new ForbiddenException('42 email is already in use, but has not been registered via 42.');
    try {
      const newUser = await this.usersService.create({
        email: req.user.email,
        fortyTwoSub: req.user.sub,
        fortyTwoRefreshToken: req.user.refreshToken,
      })
      return this.generateAccessToken(newUser)
    } catch(err) {
      throw new Error(err)
    }
  }

  async signUpGoogle(req) {
    if (!req.user) throw new BadRequestException();

    let user = (await this.usersService.findBy({ where: [{ googleSub: req.user.sub }] }))[0];
    if (user)
      throw new ForbiddenException('This account already exists. Please sign in with google instead.');
    user = (await this.usersService.findBy({ where: [{ email: req.user.email }]}))[0];
    if (user)
      throw new ForbiddenException('Google email is already in use, but has not been registered via google. Please sign in with your password.');
    try {
      const newUser = await this.usersService.create({
        email: req.user.email,
        googleSub: req.user.sub,
        googleRefreshToken: req.user.refreshToken,
      })
      return this.generateAccessToken(newUser)
    } catch(err) {
      throw new Error(err)
    }
  }

}
